import React, { useState, useEffect } from 'react';
import AdTracker from './ad-tracker';
import useInterval from './useInterval';

const SessionContext = React.createContext();

let adTracker;

const SessionProvider = (props) => {
    const [mediaUrl, setMediaUrl] = useState("https://acheung-desktop.nebula.video:20212/variant/v1/dai/DASH/Live/channel(clear)/manifest.mpd");
    const [localSessionId, setLocalSessionId] = useState(null);
    const [manifestUrl, setManifestUrl] = useState(null);
    const [adTrackingMetadataUrl, setAdTrackingMetadataUrl] = useState(null);
    const [currentTime, setCurrentTime] = useState(NaN);
    const [adPods, setAdPods] = useState([]);

    const rewriteUrlToMetadataUrl = (url) => {
        return url.replace(/\/[^/\?]+(\??[^/]*)$/, '/beacon$1');
    }

    const loadMedia = async (url) => {
        setMediaUrl(url);

        const response = await fetch(url, { redirect: 'follow', cache: 'reload' });
        let newAdTrackingMetadataUrl;

        if (response.redirected) {
            setManifestUrl(response.url);
            newAdTrackingMetadataUrl = rewriteUrlToMetadataUrl(response.url);
        } else {
            setManifestUrl(url);
            newAdTrackingMetadataUrl = rewriteUrlToMetadataUrl(url);
        }

        setAdTrackingMetadataUrl(newAdTrackingMetadataUrl);
        adTracker = new AdTracker(newAdTrackingMetadataUrl, 4000);
        setAdPods([]);
        setLocalSessionId(new Date().toISOString());

        await adTracker.refreshMetadata();
        const pods = adTracker.getAdPods();
        setAdPods(pods);
    }

    useEffect(() => {
        loadMedia(mediaUrl);
    }, []);

    useInterval(async () => {
        await adTracker.refreshMetadata();
        setAdPods(adTracker.getAdPods());
    }, 4000);

    const value = {
        localSessionId: localSessionId,
        mediaUrl: mediaUrl,
        manifestUrl: manifestUrl,
        adTrackingMetadataUrl: adTrackingMetadataUrl,
        adPods: adPods,
        currentTime: currentTime,
        load: (url) => loadMedia(url),
        updatePlayerTime: (currentTime) => {
            setCurrentTime(currentTime);
            adTracker.updatePlayerTime(currentTime * 1000);
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
