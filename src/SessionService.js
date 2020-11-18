import React, { useState, useEffect } from 'react';
import AdTracker from './ad-tracker';
import useInterval from './useInterval';

const SessionContext = React.createContext();

var adTracker;

const SessionProvider = (props) => {
    const [mediaUrl, setMediaUrl] = useState("https://acheung-desktop.nebula.video:20212/variant/v1/dai/DASH/Live/channel(clear)/manifest.mpd");
    const [localSessionId, setLocalSessionId] = useState(new Date().to);
    const [manifestUrl, setManifestUrl] = useState(null);
    const [adTrackingMetadataUrl, setAdTrackingMetadataUrl] = useState(null);
    const [currentTime, setCurrentTime] = useState(NaN);
    const [adPods, setAdPods] = useState([]);

    useEffect(() => {
        const refersh = async () => {
            const response = await fetch(mediaUrl, { redirect: 'follow', cache: 'reload' });
            var newAdTrackingMetadataUrl;

            if (response.redirected) {
                setManifestUrl(response.url);
                newAdTrackingMetadataUrl = response.url.replace(/\/[^\/]+.mpd/, '/beacon');
                // setAdTrackingMetadataUrl()
            } else {
                setManifestUrl(mediaUrl);
                newAdTrackingMetadataUrl = mediaUrl.replace(/\/[^\/]+.mpd/, '/beacon');
                // setAdTrackingMetadataUrl()
            }

            setAdTrackingMetadataUrl(newAdTrackingMetadataUrl);
            adTracker = new AdTracker(newAdTrackingMetadataUrl, 4000);
            setAdPods([]);
            await adTracker.refreshMetadata();
            const pods = adTracker.getAdPods();
            setAdPods(pods);
        }
        refersh();
    }, [localSessionId]);

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
        load: async (url) => {
            setMediaUrl(url);
            setLocalSessionId(new Date().toString());
        },
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
