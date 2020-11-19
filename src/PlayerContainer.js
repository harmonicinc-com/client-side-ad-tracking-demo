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

    const playhead = session.presentationStartTime + session.currentTime * 1000;

    const timeToNextBreak = Math.min(Infinity,
        ...session.adPods.filter(p => p.startTime > playhead).map(p => p.startTime)) - playhead;

    return (
        <div>
            <ShakaPlayer key={"player-" + session.localSessionId} src={session.manifestUrl} onTimeUpdate={updateTime} onPlaying={startTracker} onPaused={stopTracker} />
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
