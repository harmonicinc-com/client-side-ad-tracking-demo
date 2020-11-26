import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useInterval from './useInterval';
import { ErrorContext } from './ErrorContext';
import AdTrackingContext from './AdTrackingContext';
import SessionContext from './SessionContext';
import SimpleAdTracker from './SimpleAdTracker';

const AdTrackingPlaybackSessionProvider = (props) => {
    const AD_TRACING_METADATA_FILE_NAME = "metadata";

    const history = useHistory();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const urlQueryParam = searchParams.get("url");
    
    const errorContext = useContext(ErrorContext);

    const adTrackerRef = useRef();
    const [presentationStartTime, setPresentationStartTime] = useState(null);

    const [sessionInfo, setSessionInfo] = useState({
        localSessionId: null,
        mediaUrl: urlQueryParam,
        manifestUrl: null,
        adTrackingMetadataUrl: null,
    });
    const [lastPlayheadTime, setLastPlayheadTime] = useState(0);
    const [adPods, setAdPods] = useState([]);

    const rewriteUrlToMetadataUrl = (url) => {
        return url.replace(/\/[^/?]+(\??[^/]*)$/, '/' + AD_TRACING_METADATA_FILE_NAME + '$1');
    }

    const refreshMetadata = useCallback(async (url) => {
        if (url) {
            const response = await fetch(url);
            try {
                if (response.status < 200 || response.status > 299) {
                    throw new Error(`Get unexpected response code ${response.status}`);
                }
                const json = await response.json();

                setPresentationStartTime(json.dashAvailabilityStartTime);

                adTrackerRef.current.updatePods(json.pods || []);
            } catch (err) {
                console.error("Failed to download metadata for ad tracking", err);
                errorContext.reportError("metadata.request.failed", "Failed to download metadata for ad tracking: " + err);
            }
        }
    }, [errorContext]);

    const loadMedia = useCallback(async (url) => {
        let manifestUrl, adTrackingMetadataUrl;
        try {
            const response = await fetch(url, { redirect: 'follow', cache: 'reload' });
            if (response.status < 200 || response.status > 299) {
                throw new Error(`Get unexpected response code ${response.status}`);
            }

            if (response.redirected) {
                manifestUrl = response.url;
                adTrackingMetadataUrl = rewriteUrlToMetadataUrl(response.url);
            } else {
                manifestUrl = url;
                adTrackingMetadataUrl = rewriteUrlToMetadataUrl(url);
            }
        } catch (err) {
            errorContext.reportError("manifest.request.failed", "Failed to download manifest: " + err);
            return;
        }

        // workaround HLS issue that video stream needs to get first otherwise there is error "Manipulated manifest does not contain any segments"
        if (manifestUrl.includes('index.m3u8')) {
            await fetch(manifestUrl.replace("index.m3u8", "01.m3u8"));
        }

        setAdPods([]);
        adTrackerRef.current = new SimpleAdTracker();
        adTrackerRef.current.addUpdateListener(() => {
            setAdPods([...adTrackerRef.current.getAdPods()]);  // trigger re-render
        });

        setSessionInfo({
            localSessionId: new Date().toISOString(),
            mediaUrl: url,
            manifestUrl: manifestUrl,
            adTrackingMetadataUrl: adTrackingMetadataUrl
        });

        await refreshMetadata(adTrackingMetadataUrl);
    }, [refreshMetadata, errorContext]);

    const unload = () => {
        setAdPods([]);
        adTrackerRef.current = new SimpleAdTracker();
        adTrackerRef.current.addUpdateListener(() => {
            setAdPods([...adTrackerRef.current.getAdPods()]);  // trigger re-render
        });

        setPresentationStartTime(null);

        setSessionInfo({
            localSessionId: null,
            mediaUrl: null,
            manifestUrl: null,
            adTrackingMetadataUrl: null
        });
    }

    useEffect(() => {
        if (sessionInfo.mediaUrl && !sessionInfo.localSessionId) {
            loadMedia(sessionInfo.mediaUrl);
        }
    }, [loadMedia, sessionInfo]);

    useInterval(() => {
        refreshMetadata(sessionInfo.adTrackingMetadataUrl);
    }, 4000);

    const sessionContext = {
        sessionInfo: sessionInfo,
        presentationStartTime: presentationStartTime,
        load: (url) => {
            history.replace("?url=" + encodeURIComponent(url));
            loadMedia(url);
        },
        unload: unload
    };

    const adTrackingContext = {
        adPods: adPods,
        lastPlayheadTime: lastPlayheadTime,
        updatePlayheadTime: (time) => {
            adTrackerRef.current?.updatePlayheadTime(time);
            setLastPlayheadTime(time);
        },
        pause: () => adTrackerRef.current.pause(),
        resume: () => adTrackerRef.current.resume(),
        mute: () => adTrackerRef.current.mute(),
        unmute: () => adTrackerRef.current.unmute()
    };

    return (
        <SessionContext.Provider value={sessionContext}>
            <AdTrackingContext.Provider value={adTrackingContext}>
                {props.children}
            </AdTrackingContext.Provider>
        </SessionContext.Provider>
    );
};

export default AdTrackingPlaybackSessionProvider;
