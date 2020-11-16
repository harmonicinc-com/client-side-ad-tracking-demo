import React, { useState } from 'react';
import useInterval from './useInterval';

const SessionContext = React.createContext();

const SessionProvider = (props) => {
    const [adPods, setAdPods] = useState([]);

    useInterval(async () => {
        setAdPods(await reloadAdPods());
    }, 1000);

    const value = {
        manifestUrl: getManifestUrl(),
        adTrackingMetadataUrl: getAdTrackingMetadataUrl(),
        adPods: adPods
    };

    return (
        <SessionContext.Provider value={value}>
          {props.children}
        </SessionContext.Provider>
    );
};

const getManifestUrl = () => {
    return "https://acheung-desktop.nebula.video:20212/variant/v1/dai/DASH/Live/channel(clear)/manifest.mpd?sessid=d4cc3c7f-0141-49e0-96d1-fe0a5f6482f3"
};

const getAdTrackingMetadataUrl = () => {
    return "https://acheung-desktop.nebula.video:20212/variant/v1/dai/DASH/Live/channel(clear)/beacon?sessid=d4cc3c7f-0141-49e0-96d1-fe0a5f6482f3"
};

const reloadAdPods = async () => {
    const response = await fetch(getAdTrackingMetadataUrl());
    const json = await response.json();
    console.log('reloadAdPods', json);
    return json.pods;
}

export { SessionProvider, SessionContext };
