import React, { useEffect } from 'react';
import ShakaPlayer from './ShakaPlayer';
import { SessionContext } from './SessionService';
import AdTrackingContext from './AdTrackingContext';

function PlayerContainer() {
    const session = React.useContext(SessionContext);

    const adTrackingContext = React.useContext(AdTrackingContext);

    const shakaRef = React.createRef();

    const localSessionRef = React.useRef(); 

    const updateTime = (time) => {
        session.updatePlayerTime(time);
    };

    const startTracker = () => {
        session.setPlaybackStarted();
    }; 

    const stopTracker = () => {
        session.setPlaybackPaused();
    };

    const onError = (error) => {
      console.error("Error from player", error);
    }

    const playhead = session.presentationStartTime + session.currentTime * 1000;

    const timeToNextBreak = Math.min(Infinity,
        ...session.adPods.filter(p => p.startTime > playhead).map(p => p.startTime)) - playhead;

    useEffect(() => {
        if (localSessionRef.current !== session.localSessionId) {
            if (session.manifestUrl) {
                shakaRef.current.load(session.manifestUrl);
            } else {
                shakaRef.current.unload();
            }
            localSessionRef.current = session.localSessionId
        }
    }, [shakaRef, session.localSessionId, session.manifestUrl]);

    return (
        <div>
            <ShakaPlayer ref={shakaRef}
                onTimeUpdate={updateTime}
                onPlaying={startTracker}
                onPaused={stopTracker}
                onMute={() => adTrackingContext.mute()}
                onUnmute={() => adTrackingContext.unmute()}
                onError={onError}/>
            <div>
                Raw currentTime from video element: {session.currentTime.toFixed(1)}s
            </div>
            <div>
                Playhead date time: {new Date(playhead).toLocaleString()}
            </div>
            <div>
                Time to next ad break: {timeToNextBreak !== Infinity ? Math.ceil(timeToNextBreak/1000).toFixed(0) + 's' : '-'}
            </div>
        </div>
    );
}

export default PlayerContainer;
