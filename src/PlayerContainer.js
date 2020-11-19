import React from 'react';
import ShakaPlayer from './ShakaPlayer';
import { SessionContext } from './SessionService';

function PlayerContainer() {
    const session = React.useContext(SessionContext);

    const updateTime = (time) => {
        session.updatePlayerTime(time);
    };

    const startTracker = () => {
        session.setPlaybackStarted();
    }; 

    const stopTracker = () => {
        session.setPlaybackPaused();
    };

    return (
        <div>
            <div>
                <ShakaPlayer key={"player-" + session.localSessionId} src={session.manifestUrl} onTimeUpdate={updateTime} onPlaying={startTracker} onPaused={stopTracker} />
                Raw currentTime from video element: {session.currentTime.toFixed(1)}s
            </div>
            <div>
                Playhead date time: {new Date(session.presentationStartTime + session.currentTime * 1000).toLocaleString()}
            </div>
        </div>
    );
}

export default PlayerContainer;
