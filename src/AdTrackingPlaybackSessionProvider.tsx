import {useState, useEffect, useRef, useContext, useCallback} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useInterval from './useInterval';
import { ErrorContext } from './ErrorContext';
import AdTrackingContext from './AdTrackingContext';
import SessionContext from './SessionContext';
import SimpleAdTracker from './SimpleAdTracker';
import SimpleAdTrackerInterface from "../types/SimpleAdTrackerInterface";
import SessionContextInterface from "../types/SessionContextInterface";
import AdBeacon, {DataRange} from "../types/AdBeacon";
import ErrorContextInterface from "../types/ErrorContextInterface";

const AdTrackingPlaybackSessionProvider = (props: any) => {
    const AD_TRACING_METADATA_FILE_NAME = "metadata";

    // Fetch the next metadata n ms early. Used in isInRange().
    const EARLY_FETCH_MS = 5000;

    const history = useHistory();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const urlQueryParam = searchParams.get("url");

    const errorContext = useContext<ErrorContextInterface>(ErrorContext);

    const adTrackerRef = useRef<SimpleAdTracker>();
    const [presentationStartTime, setPresentationStartTime] = useState(0);

    const [sessionInfo, setSessionInfo] = useState({
        localSessionId: "",
        mediaUrl: urlQueryParam,
        manifestUrl: null,
        adTrackingMetadataUrl: "",
    });
    const [lastPlayheadTime, setLastPlayheadTime] = useState(0);
    const [lastPrftPlayheadTime, setLastPrftPlayheadTime] = useState(0);
    const [adPods, setAdPods] = useState<any>([]);
    const [lastDataRange, setLastDataRange] = useState<DataRange>({
        start: 0,
        end: 0,
    });

    const rewriteUrlToMetadataUrl = (url: string) => {
        return url.replace(/\/[^/?]+(\??[^/]*)$/, '/' + AD_TRACING_METADATA_FILE_NAME + '$1');
    }

    const refreshMetadata = useCallback(async (url: string, time = 0, prft = false): Promise<boolean> => {
        const isInRange = (time: number, prft: boolean, range?: DataRange) => {
            // Bypass checking only if time === 0, not null | undefined
            // Happens on initial load.
            if (time === 0) return true;
            const dataRange = range || lastDataRange;
            if (prft && dataRange.prftStart && dataRange.prftEnd) {
                return time >= dataRange.prftStart && time <= dataRange.prftEnd - EARLY_FETCH_MS;
            } else {
                return time >= dataRange.start && time <= dataRange.end - EARLY_FETCH_MS;
            }
        }

        console.log(`refreshMetadata: ${url}`);
        if (url) {
            try {
                const response = await fetch(url);
                if (response.status < 200 || response.status > 299) {
                    throw new Error(`Get unexpected response code ${response.status}`);
                }
                const json: AdBeacon = await response.json();
                setLastDataRange(json.dataRange);

                if (!isInRange(time, prft, json.dataRange)) {
                    console.log(`Invalid metadata: Not in range. Time: ${time}, PRFT: ${prft}`, json.dataRange);
                    return false;
                }

                if (adTrackerRef.current !== undefined) {
                    adTrackerRef.current.updatePods(json.adBreaks || []);
                    return true;
                }
            } catch (err) {
                console.error("Failed to download metadata for ad tracking", err);
                errorContext.reportError("metadata.request.failed", "Failed to download metadata for ad tracking: " + err);
            }
        }
        return false;
    }, [errorContext, lastDataRange]);

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
        const pods = adTrackerRef.current.getAdPods();
        adTrackerRef.current.addUpdateListener(() => {
            setAdPods([...pods]);  // trigger re-render
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
        const pods = adTrackerRef.current.getAdPods();
        adTrackerRef.current.addUpdateListener(() => {
            setAdPods([...pods]);  // trigger re-render
        });

        setPresentationStartTime(0);

        setSessionInfo({
            localSessionId: "",
            mediaUrl: null,
            manifestUrl: null,
            adTrackingMetadataUrl: ""
        });
    }

    useEffect(() => {
        if (sessionInfo.mediaUrl && !sessionInfo.localSessionId) {
            loadMedia(sessionInfo.mediaUrl);
        }
    }, [loadMedia, sessionInfo]);

    useInterval(async () => {
        const isInRange = (time: number, prft: boolean) => {
            if (prft && lastDataRange.prftStart && lastDataRange.prftEnd) {
                return time >= lastDataRange.prftStart && time <= lastDataRange.prftEnd - EARLY_FETCH_MS;
            } else {
                return time >= lastDataRange.start && time <= lastDataRange.end - EARLY_FETCH_MS;
            }
        }

        console.log(`PRFT: ${lastPrftPlayheadTime}; In range: ${isInRange(lastPrftPlayheadTime, true)}`);
        console.log(`Raw: ${lastPlayheadTime}; In range: ${isInRange((lastPlayheadTime), false)}`);

        let url = sessionInfo.adTrackingMetadataUrl;
        if (!url) return;

        if (lastDataRange.prftStart && lastDataRange.prftEnd && lastPrftPlayheadTime > 0) {
            if (!isInRange(lastPrftPlayheadTime, true) &&
                !(await refreshMetadata(url, lastPrftPlayheadTime, true))) {
                    url = `${url}&prftStart=${lastPrftPlayheadTime}`;
                    refreshMetadata(url);
            }
        } else if (lastPlayheadTime &&
            !isInRange((lastPlayheadTime), false) &&
            !(await refreshMetadata(url, lastPlayheadTime, false))) {
            url = `${url}&start=${lastPlayheadTime}`;
            refreshMetadata(url);
        }
    }, 4000);

    const sessionContext: SessionContextInterface = {
        sessionInfo: sessionInfo,
        presentationStartTime: presentationStartTime,
        load: (url) => {
            history.replace("?url=" + encodeURIComponent(url));
            return loadMedia(url);
        },
        unload: unload
    };

    const adTrackingContext: SimpleAdTrackerInterface = {
        adPods: adPods,
        lastPlayheadTime,
        lastPrftPlayheadTime,
        presentationStartTime,
        updatePlayheadTime: (time) => {
            setLastPlayheadTime(time);
        },
        updatePrftPlayheadTime: (time) => {
            setLastPrftPlayheadTime(time);
        },
        updatePresentationStartTime: (time) => {
            setPresentationStartTime(time);
        },
        needSendBeacon: (time) => adTrackerRef.current?.needSendBeacon(time),
        pause: () => adTrackerRef.current?.pause(),
        resume: () => adTrackerRef.current?.resume(),
        mute: () => adTrackerRef.current?.mute(),
        unmute: () => adTrackerRef.current?.unmute()
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
