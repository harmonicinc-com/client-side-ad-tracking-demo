import React, { useState } from 'react';
import ShakaPlayer from './ShakaPlayer';
import { SessionContext } from './SessionService';

function PlayerContainer() {
    const session = React.useContext(SessionContext);
    const updateTime = (time, video, player) => {
        // const playheadTime = player.getPlayheadTimeAsDate().getTime();
        const playheadTime = new Date('2020-11-16T15:43:46Z').getTime() + time * 1000;
        session.updatePlayerTime(time, playheadTime);
    }
    return (
        <div>
            <ShakaPlayer src={session.manifestUrl} onTimeUpdate={updateTime} />
            <div>
                currentTime: {session.currentTime.toFixed(1)}s
            </div>
            <div>
                Playhead time: {new Date(session.playheadTime).toLocaleString()}
            </div>
        </div>
    );
}

export default PlayerContainer;
