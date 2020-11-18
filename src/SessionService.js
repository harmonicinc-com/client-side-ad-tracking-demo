import React, { useState, useEffect } from 'react';
import AdTracker from './ad-tracker';
import useInterval from './useInterval';

const SessionContext = React.createContext();

let adTracker;

let presentationStartTime;

const SessionProvider = (props) => {
    const [mediaUrl, setMediaUrl] = useState("https://acheung-desktop.nebula.video:20212/variant/v1/dai/DASH/Live/channel(clear)/manifest.mpd");
    const [localSessionId, setLocalSessionId] = useState(null);
    const [manifestUrl, setManifestUrl] = useState(null);
    const [adTrackingMetadataUrl, setAdTrackingMetadataUrl] = useState(null);
    const [currentTime, setCurrentTime] = useState(NaN);
    const [adPods, setAdPods] = useState([]);

    const rewriteUrlToMetadataUrl = (url) => {
        return url.replace(/\/[^/?]+(\??[^/]*)$/, '/beacon$1');
    }

    const loadMedia = async (url) => {
        setMediaUrl(url);

        const response = await fetch(url, { redirect: 'follow', cache: 'reload' });
        let newManifestUrl;
        let newAdTrackingMetadataUrl;

        if (response.redirected) {
            newManifestUrl = response.url;
            newAdTrackingMetadataUrl = rewriteUrlToMetadataUrl(response.url);
        } else {
            newManifestUrl = url;
            newAdTrackingMetadataUrl = rewriteUrlToMetadataUrl(url);
        }

        // workaround HLS issue that video stream needs to get first otherwise there is error "Manipulated manifest does not contain any segments"
        if (newManifestUrl.includes('index.m3u8')) {
            await fetch(newManifestUrl.replace("index.m3u8", "01.m3u8"));
        }

        setManifestUrl(newManifestUrl);
        setAdTrackingMetadataUrl(newAdTrackingMetadataUrl);
        adTracker = new AdTracker();
        setAdPods([]);
        setLocalSessionId(new Date().toISOString());

        await refreshMetadata(newAdTrackingMetadataUrl);
    }

    const refreshMetadata = async (url) => {
        const response = await fetch(url);
        try {
            if (response.status < 200 || response.status > 299) {
                throw new Error(`Get unexpected response code {response.status}`);
            }
            const json = await response.json();

            presentationStartTime = json.dashAvailabilityStartTime;

            adTracker.updatePods(json.pods || []);
            setAdPods(adTracker.getAdPods());
        } catch (err) {
            console.error("Failed to refresh metadata", err);
        }
    }

    useEffect(() => {
        loadMedia(mediaUrl);
    }, []);

    useInterval(() => {
        refreshMetadata(adTrackingMetadataUrl);
    }, 4000);

    const value = {
        localSessionId: localSessionId,
        mediaUrl: mediaUrl,
        manifestUrl: manifestUrl,
        adTrackingMetadataUrl: adTrackingMetadataUrl,
        presentationStartTime: presentationStartTime,
        adPods: adPods,
        currentTime: currentTime,
        load: (url) => loadMedia(url),
        updatePlayerTime: (currentTime) => {
            setCurrentTime(currentTime);
            adTracker.updatePlayerTime(presentationStartTime + currentTime * 1000);
        },
        setPlaybackStarted: () => {
            adTracker.start();
        },
        setPlaybackPaused: () => {
            adTracker.stop();
        },
    };

    return (
        <SessionContext.Provider value={value}>
          {props.children}
        </SessionContext.Provider>
    );
};

export { SessionProvider, SessionContext };
