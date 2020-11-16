import React from 'react';
import ShakaPlayer from './ShakaPlayer';
import { SessionContext } from './SessionService';

function PlayerContainer() {
    const session = React.useContext(SessionContext);
    return <ShakaPlayer src={session.manifestUrl}/>;
}

export default PlayerContainer;
