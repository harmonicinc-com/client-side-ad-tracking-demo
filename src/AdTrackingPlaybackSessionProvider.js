import { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useInterval from './useInterval';
import AdTrackingContext from './AdTrackingContext';
import SessionContext from './SessionContext';
import PlaybackContext from './PlaybackContext';
import AdTracker from './AdTracker';

const AdTrackingPlaybackSessionProvider = (props) => {
    const history = useHistory();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const urlQueryParam = searchParams.get("url");

    const adTrackerRef = useRef();
    const presentationStartTimeRef = useRef();

    const [sessionInfo, setSessionInfo] = useState({
        localSessionId: urlQueryParam ? new Date().toISOString() : null,
        mediaUrl: urlQueryParam,
        manifestUrl: null,
        adTrackingMetadataUrl: null,
    });
    const [currentTime, setCurrentTime] = useState(NaN);
    const [adPods, setAdPods] = useState([]);

    const rewriteUrlToMetadataUrl = (url) => {
        return url.replace(/\/[^/?]+(\??[^/]*)$/, '/beacon$1');
    }

    const loadMedia = async (url) => {
        let manifestUrl, adTrackingMetadataUrl;
        const response = await fetch(url, { redirect: 'follow', cache: 'reload' });
        if (response.redirected) {
            manifestUrl = response.url;
            adTrackingMetadataUrl = rewriteUrlToMetadataUrl(response.url);
        } else {
            manifestUrl = url;
            adTrackingMetadataUrl = rewriteUrlToMetadataUrl(url);
        }

        // workaround HLS issue that video stream needs to get first otherwise there is error "Manipulated manifest does not contain any segments"
        if (manifestUrl.includes('index.m3u8')) {
            await fetch(manifestUrl.replace("index.m3u8", "01.m3u8"));
        }

        setAdPods([]);
        adTrackerRef.current = new AdTracker();
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
    }

    const unload = () => {
        setAdPods([]);
        adTrackerRef.current = new AdTracker();
        adTrackerRef.current.addUpdateListener(() => {
            setAdPods([...adTrackerRef.current.getAdPods()]);  // trigger re-render
        });

        presentationStartTimeRef.current = null;

        setSessionInfo({
            localSessionId: null,
            mediaUrl: null,
            manifestUrl: null,
            adTrackingMetadataUrl: null
        });
    }

    const refreshMetadata = async (url) => {
        if (url) {
            const response = await fetch(url);
            try {
                if (response.status < 200 || response.status > 299) {
                    throw new Error(`Get unexpected response code {response.status}`);
                }
                const json = await response.json();

                presentationStartTimeRef.current = json.dashAvailabilityStartTime;

                adTrackerRef.current.updatePods(json.pods || []);
            } catch (err) {
                console.error("Failed to refresh metadata", err);
            }
        }
    }

    useEffect(() => {
        if (sessionInfo.mediaUrl) {
            loadMedia(sessionInfo.mediaUrl);
        }
    }, []);

    useInterval(() => {
        refreshMetadata(sessionInfo.adTrackingMetadataUrl);
    }, 4000);

    const sessionContext = {
        sessionInfo: sessionInfo,
        presentationStartTime: presentationStartTimeRef.current,
        load: (url) => {
            history.replace("?url=" + encodeURIComponent(url));
            loadMedia(url);
        },
        unload: unload
    };

    const playbackContext = {
        currentTime: currentTime,
        updatePlayerTime: (currentTime) => setCurrentTime(currentTime)
    };

    const adTrackingContext = {
        adPods: adPods,
        updatePlayerTime: (time) => adTrackerRef.current?.updatePlayerTime(time),
        pause: () => adTrackerRef.current.pause(),
        resume: () => adTrackerRef.current.resume(),
        mute: () => adTrackerRef.current.mute(),
        unmute: () => adTrackerRef.current.unmute()
    };

    return (
        <SessionContext.Provider value={sessionContext}>
          <PlaybackContext.Provider value={playbackContext}>
            <AdTrackingContext.Provider value={adTrackingContext}>
              {props.children}
            </AdTrackingContext.Provider>
          </PlaybackContext.Provider>
        </SessionContext.Provider>
    );
};

export default AdTrackingPlaybackSessionProvider;
