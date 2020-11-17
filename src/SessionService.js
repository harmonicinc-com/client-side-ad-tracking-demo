import React, { useState, useEffect } from 'react';
import AdTracker from './ad-tracker';
import useInterval from './useInterval';

const SessionContext = React.createContext();

var adTracker;

const SessionProvider = (props) => {
    const manifestUrl = "https://acheung-desktop.nebula.video:20212/variant/v1/dai/DASH/Live/channel(clear)/manifest.mpd?sessid=d4cc3c7f-0141-49e0-96d1-fe0a5f6482f3";
    const adTrackingMetadataUrl = "https://acheung-desktop.nebula.video:20212/variant/v1/dai/DASH/Live/channel(clear)/beacon?sessid=d4cc3c7f-0141-49e0-96d1-fe0a5f6482f3";
    const [localSessionId, setLocalSessionId] = useState(null);
    const [currentTime, setCurrentTime] = useState(NaN);
    const [adPods, setAdPods] = useState([]);

    useEffect(() => {
        adTracker = new AdTracker(adTrackingMetadataUrl, 4000);
        setAdPods([]);
        const refersh = async () => {
            await adTracker.refreshMetadata();
            setAdPods(adTracker.getAdPods());
        }
        refersh();
    }, [localSessionId]);

    useInterval(async () => {
        await adTracker.refreshMetadata();
        setAdPods(adTracker.getAdPods());
    }, 4000);

    const value = {
        localSessionId: localSessionId,
        manifestUrl: manifestUrl,
        adTrackingMetadataUrl: adTrackingMetadataUrl,
        adPods: adPods,
        currentTime: currentTime,
        load: (url) => {
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
