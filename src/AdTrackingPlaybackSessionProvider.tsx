import {useState, useEffect, useRef, useContext, useCallback} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useInterval from './useInterval';
import { ErrorContext } from './ErrorContext';
import AdTrackingContext from './AdTrackingContext';
import SessionContext from './SessionContext';
import SimpleAdTracker from './SimpleAdTracker';
import SessionContextInterface from "../types/SessionContextInterface";
import AdBeacon, {DataRange} from "../types/AdBeacon";
import ErrorContextInterface from "../types/ErrorContextInterface";
import { InitResponse } from '../types/InitResponse';

const AdTrackingPlaybackSessionProvider = (props: any) => {
    const AD_TRACING_METADATA_FILE_NAME = "metadata";

    const LIVE_METADATA_TIMESPAN_MS = 120000
    const MIN_METADATA_INTERVAL_MS = 2000
    const MIN_METADATA_LOOK_AHEAD_MS = 5000 // to avoid missing ads, it should be larger than MIN_METADATA_INTERVAL_MS

    const history = useHistory();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const urlQueryParam = searchParams.get("url");
    const lowLatencyQueryParam = searchParams.get("low_latency");

    const errorContext = useContext<ErrorContextInterface>(ErrorContext);

    const adTrackerRef = useRef<SimpleAdTracker>();
    const [presentationStartTime, setPresentationStartTime] = useState(0);

    const [sessionInfo, setSessionInfo] = useState({
        localSessionId: "",
        mediaUrl: urlQueryParam,
        lowLatencyMode: lowLatencyQueryParam === "true",
        initRequest: true,
        manifestUrl: null,
        adTrackingMetadataUrl: "",
    });
    const [lastPlayheadTime, setLastPlayheadTime] = useState(0);
    const [adPods, setAdPods] = useState<any>([]);
    const [lastDataRange, setLastDataRange] = useState<DataRange | null>(null);
    const [liveEdge, setLiveEdge] = useState(0);

    const getInitRequestInfo = useCallback(async (url: string) => {
        let manifestUrl = "";
        let adTrackingMetadataUrl = "";

        // First try GET request with initSession=true query parameter
        try {
            const getUrl = new URL(url);
            getUrl.searchParams.set('initSession', 'true');
            
            const response = await fetch(getUrl.toString());
            if (response.status === 200) {
                const initResponse: InitResponse = await response.json();
                if (initResponse.manifestUrl) {
                    manifestUrl = initResponse.manifestUrl;
                }
                if (initResponse.trackingUrl) {
                    adTrackingMetadataUrl = initResponse.trackingUrl;
                }
                
                // If we got valid data, return it
                if (manifestUrl || adTrackingMetadataUrl) {
                    return {
                        manifestUrl,
                        adTrackingMetadataUrl
                    };
                }
            }
        } catch (err) {
            console.log("GET request with initSession=true failed, trying POST fallback:", err);
        }

        // Fallback to POST request
        try {
            const response = await fetch(url, { method: 'POST' });
            if (response.status !== 200) {
                throw new Error(`POST init request got unexpected response code: ${response.status}`);
            }

            const initResponse: InitResponse = await response.json();
            if (initResponse.manifestUrl) {
                manifestUrl = initResponse.manifestUrl;
            }
            if (initResponse.trackingUrl) {
                adTrackingMetadataUrl = initResponse.trackingUrl;
            }
        } catch (err) {
            errorContext.reportError("init.request.failed", "Failed init session with POST request: " + err);
        }

        return {
            manifestUrl,
            adTrackingMetadataUrl
        };
    }, [errorContext]);

    const rewriteUrlToMetadataUrl = (url: string) => {
        return url.replace(/\/[^/?]+(\??[^/]*)$/, '/' + AD_TRACING_METADATA_FILE_NAME + '$1');
    }

    const parseHLSManifest = (manifestContent: string, baseUrl: string): string | null => {
        const lines = manifestContent.split('\n');
        const baseUrlObj = new URL(baseUrl);
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            // Look for media playlist URLs (not metadata or other directives)
            if (line && !line.startsWith('#') && line.includes('.m3u8')) {
                try {
                    // Resolve the URL relative to the base URL
                    const resolvedUrl = new URL(line, baseUrl);
                    
                    // Check if the resolvedUrl's path has the prefix "/pmm-"
                    const pmmMatch = resolvedUrl.pathname.match(/^\/pmm-[^/]*/);
                    let resultPath = baseUrlObj.pathname;
                    
                    if (pmmMatch) {
                        // Prepend the pmm prefix to the base URL path
                        resultPath = pmmMatch[0] + baseUrlObj.pathname;
                    }
                    
                    // Create the new URL with original host and the determined path
                    const newUrl = new URL(baseUrlObj.origin + resultPath);
                    
                    // Use query params from resolvedUrl but remove "isstream"
                    const searchParams = new URLSearchParams(resolvedUrl.search);
                    searchParams.delete('isstream');
                    newUrl.search = searchParams.toString();
                    
                    return newUrl.href;
                } catch (err) {
                    console.warn('Failed to parse HLS media playlist URL:', line, err);
                }
            }
        }
        return null;
    }

    const parseDASHManifest = (manifestContent: string, baseUrl: string): string | null => {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(manifestContent, 'text/xml');
            
            // Look for Location element
            const locationElement = xmlDoc.querySelector('Location');
            if (locationElement && locationElement.textContent) {
                // Resolve the URL relative to the base URL and preserve any new paths/query params
                const resolvedUrl = new URL(locationElement.textContent.trim(), baseUrl);
                return resolvedUrl.href;
            }
        } catch (err) {
            console.warn('Failed to parse DASH manifest:', err);
        }
        return null;
    }

    const refreshMetadata = useCallback(async (url: string) => {
        if (!url) {
            return;
        }
        
        console.log(`refreshMetadata: ${url}`);
        try {
            const response = await fetch(url);
            if (response.status < 200 || response.status > 299) {
                throw new Error(`Get unexpected response code ${response.status}`);
            }
            const json: AdBeacon = await response.json();
            setLastDataRange(json.dataRange);

            if (adTrackerRef.current !== undefined) {
                adTrackerRef.current.updatePods(json.adBreaks || []);
            }
        } catch (err) {
            console.error("Failed to download metadata for ad tracking", err);
            errorContext.reportError("metadata.request.failed", "Failed to download metadata for ad tracking: " + err);
        }
    }, [errorContext]);

    const loadMedia = useCallback(async (url, lowLatencyMode: boolean, initRequest: boolean) => {
        let manifestUrl, adTrackingMetadataUrl;
        
        if (initRequest) {
            const initResponse = await getInitRequestInfo(url);
            if (initResponse.manifestUrl && initResponse.adTrackingMetadataUrl) {
                manifestUrl = new URL(initResponse.manifestUrl, url).href;
                adTrackingMetadataUrl = new URL(initResponse.adTrackingMetadataUrl, url).href;
                console.log(`Got init request info: manifestUrl=${manifestUrl}, adTrackingMetadataUrl=${adTrackingMetadataUrl}`);
            } else {
                console.log("Failed to get init request info, falling back to GET request");
            }
        }

        if (!manifestUrl || !adTrackingMetadataUrl) {
            try {
                const response = await fetch(url, { redirect: 'follow', cache: 'reload' });
                if (response.status < 200 || response.status > 299) {
                    throw new Error(`Get unexpected response code ${response.status}`);
                }

                if (response.redirected) {
                    manifestUrl = response.url;
                    adTrackingMetadataUrl = rewriteUrlToMetadataUrl(response.url);
                } else {
                    // No redirect found, parse the manifest content
                    const manifestContent = await response.text();
                    const baseUrl = url;
                    
                    // Try to parse as HLS first
                    const hlsUrl = parseHLSManifest(manifestContent, baseUrl);
                    if (hlsUrl) {
                        manifestUrl = hlsUrl;
                        adTrackingMetadataUrl = rewriteUrlToMetadataUrl(hlsUrl);
                        console.log(`Parsed HLS manifest: ${manifestUrl}`);
                    } else {
                        // Try to parse as DASH
                        const dashUrl = parseDASHManifest(manifestContent, baseUrl);
                        if (dashUrl) {
                            manifestUrl = dashUrl;
                            adTrackingMetadataUrl = rewriteUrlToMetadataUrl(dashUrl);
                            console.log(`Parsed DASH manifest: ${manifestUrl}`);
                        } else {
                            // Fallback to original behavior
                            manifestUrl = url;
                            adTrackingMetadataUrl = rewriteUrlToMetadataUrl(url);
                            console.log(`No manifest URLs found, using original URL: ${manifestUrl}`);
                        }
                    }
                }
            } catch (err) {
                errorContext.reportError("manifest.request.failed", "Failed to download manifest: " + err);
                return;
            }
        }

        // workaround HLS issue that video stream needs to get first otherwise there is error "Manipulated manifest does not contain any segments"
        if (manifestUrl.includes('index.m3u8')) {
            await fetch(manifestUrl.replace("index.m3u8", "01.m3u8"));
        }

        setAdPods([]);
        setLastDataRange(null)
        adTrackerRef.current = new SimpleAdTracker();
        const pods = adTrackerRef.current.getAdPods();
        adTrackerRef.current.addUpdateListener(() => {
            setAdPods([...pods]);  // trigger re-render
        });

        setSessionInfo({
            localSessionId: new Date().toISOString(),
            mediaUrl: url,
            lowLatencyMode,
            initRequest,
            manifestUrl: manifestUrl,
            adTrackingMetadataUrl: adTrackingMetadataUrl
        });

        await refreshMetadata(adTrackingMetadataUrl);
    }, [getInitRequestInfo, refreshMetadata, errorContext]);

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
            lowLatencyMode: sessionInfo.lowLatencyMode,
            initRequest: sessionInfo.initRequest,
            manifestUrl: null,
            adTrackingMetadataUrl: ""
        });
    }

    useEffect(() => {
        if (sessionInfo.mediaUrl && !sessionInfo.localSessionId) {
            loadMedia(sessionInfo.mediaUrl, sessionInfo.lowLatencyMode, sessionInfo.initRequest);
        }
    }, [loadMedia, sessionInfo]);

    useInterval(async () => {
        if (!lastDataRange) {
            return  // skip until initial range is fetched
        }

        let useLiveMetadata = lastPlayheadTime > liveEdge - LIVE_METADATA_TIMESPAN_MS
        if (useLiveMetadata) {
            if (!lastDataRange.end || lastPlayheadTime + MIN_METADATA_LOOK_AHEAD_MS > lastDataRange.end) {
                refreshMetadata(sessionInfo.adTrackingMetadataUrl);
            }
        } else if (!lastDataRange.end || lastPlayheadTime < lastDataRange.start || lastPlayheadTime > lastDataRange.end) {            
            const url = new URL(sessionInfo.adTrackingMetadataUrl);
            url.searchParams.append('start', lastPlayheadTime.toFixed(0));
            refreshMetadata(url.toString());
        }
    }, MIN_METADATA_INTERVAL_MS);

    const sessionContext: SessionContextInterface = {
        sessionInfo: sessionInfo,
        presentationStartTime: presentationStartTime,
        load: (url, lowLatencyMode, initRequest) => {
            history.replace("?url=" + encodeURIComponent(url) + (lowLatencyMode ? "&low_latency=true" : ""));
            return loadMedia(url, lowLatencyMode, initRequest);
        },
        unload: unload
    };

    const adTrackingContext = {
        adPods: adPods,
        lastPlayheadTime,
        presentationStartTime,
        metadataTimeRange: lastDataRange,
        updatePresentationStartTime: (time: number) => {
            setPresentationStartTime(time);
        },
        updatePlayheadTime: (time: number) => {
            setLastPlayheadTime(time);
            adTrackerRef.current?.updatePlayheadTime(time);
        },
        updateLiveEdge: (liveEdge: number) => {
            setLiveEdge(liveEdge);
        },
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
