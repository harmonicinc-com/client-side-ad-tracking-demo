import React from 'react';

const SessionContext = React.createContext();

const SessionProvider = (props) => {
    const value = {
        getManifestUrl: getManifestUrl,
        getAdTrackingMetadataUrl: getAdTrackingMetadataUrl,
        getAdPods: getAdPods
    };

    return (
        <SessionContext.Provider value={value}>
          {props.children}
        </SessionContext.Provider>
    );
    // let manifestUrl = "https://acheung-desktop.nebula.video:20212/variant/v1/dai/DASH/Live/channel(clear)/manifest.mpd?sessid=d4cc3c7f-0141-49e0-96d1-fe0a5f6482f3"
    // let beaconUrl = "https://acheung-desktop.nebula.video:20212/variant/v1/dai/DASH/Live/channel(clear)/beacon?sessid=d4cc3c7f-0141-49e0-96d1-fe0a5f6482f3"
    // return (<div></div>);
};

const getManifestUrl = () => {
    return "https://acheung-desktop.nebula.video:20212/variant/v1/dai/DASH/Live/channel(clear)/manifest.mpd?sessid=d4cc3c7f-0141-49e0-96d1-fe0a5f6482f3"
};

const getAdTrackingMetadataUrl = () => {
    return "https://acheung-desktop.nebula.video:20212/variant/v1/dai/DASH/Live/channel(clear)/beacon?sessid=d4cc3c7f-0141-49e0-96d1-fe0a5f6482f3"
};

const getAdPods = () => {
    return [
        {
          "id": "/DBLAAAAAAAAAP/wBQb+7WKJTgA1AilDVUVJAAAAC3/eAABSZcABFU5hdGlvbmFsX0JhY2tPdXRfR3JwMjAAAPAIUFM5S1RlJPfftRuO",
          "start": 1605495159146,
          "duration": 1000,
          "ads": [
            {
              "id": "default",
              "start": 1605495159146,
              "duration": 53653
            }
          ]
        },
        {
          "id": "/DBLAAAAAAAAAP/wBQb+7hAzyAA1AilDVUVJAAAACn/eAABSZcABFU5hdGlvbmFsX0JhY2tPdXRfR3JwMjAAAPAIUFM5S1RlJKew3/Gk",
          "start": 1605495286606,
          "duration": 8409,
          "ads": [
            {
              "id": "default-1s",
              "start": 1605495285606,
              "duration": 9409,
              "trackingUrls": [
                {
                  "event": "impression",
                  "startTime": 1605495285606,
                  "url": "http://localhost:4647/beacon?t=1605495282734935657&id=default-30s&cn=defaultImpression"
                }
              ]
            },
            {
              "id": "default-30s",
              "start": 1605495286606,
              "duration": 9409,
              "trackingUrls": [
                {
                  "event": "impression",
                  "startTime": 1605495286606,
                  "url": "http://localhost:4647/beacon?t=1605495282734935657&id=default-30s&cn=defaultImpression"
                },
                {
                  "event": "firstQuartile",
                  "startTime": 1605495293106,
                  "url": "http://localhost:4647/beacon?t=1605495282734935657&id=default-30s&cn=firstQuartile"
                },
                {
                  "event": "mute",
                  "url": "http://localhost:4647/beacon?t=1605495282734935657&id=default-30s&cn=mute"
                },
                {
                  "event": "unmute",
                  "url": "http://localhost:4647/beacon?t=1605495282734935657&id=default-30s&cn=unmute"
                },
                {
                  "event": "collapse",
                  "url": "http://localhost:4647/beacon?t=1605495282734935657&id=default-30s&cn=collapse"
                },
                {
                  "event": "expand",
                  "url": "http://localhost:4647/beacon?t=1605495282734935657&id=default-30s&cn=expand"
                },
                {
                  "event": "pause",
                  "url": "http://localhost:4647/beacon?t=1605495282734935657&id=default-30s&cn=pause"
                },
                {
                  "event": "resume",
                  "url": "http://localhost:4647/beacon?t=1605495282734935657&id=default-30s&cn=resume"
                },
                {
                  "event": "rewind",
                  "url": "http://localhost:4647/beacon?t=1605495282734935657&id=default-30s&cn=rewind"
                },
                {
                  "event": "acceptInvitation",
                  "url": "http://localhost:4647/beacon?t=1605495282734935657&id=default-30s&cn=acceptInvitation"
                },
                {
                  "event": "close",
                  "url": "http://localhost:4647/beacon?t=1605495282734935657&id=default-30s&cn=close"
                }
              ]
            }
          ]
        }
    ];
}

export { SessionProvider, SessionContext };
