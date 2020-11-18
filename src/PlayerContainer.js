import React from 'react';
import ShakaPlayer from './ShakaPlayer';
import { SessionContext } from './SessionService';

function PlayerContainer() {
    const session = React.useContext(SessionContext);

    const updateTime = (time, video, player) => {
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
            {session.localSessionId ?
                <ShakaPlayer key={"player-" + session.localSessionId} src={session.manifestUrl} onTimeUpdate={updateTime} onPlaying={startTracker} onPaused={stopTracker} />
                : null }
            <div>
                Raw currentTime from video element: {session.currentTime.toFixed(1)}s
            </div>
            <div>
                Playhead date time: {new Date(session.presentationStartTime + session.currentTime * 1000).toLocaleString()}
            </div>
        </div>
    );
}

export default PlayerContainer;
