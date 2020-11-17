import React from 'react';
import TextField from '@material-ui/core/TextField';
import { SessionContext } from './SessionService';

function InfoSection() {
    const session = React.useContext(SessionContext);

    return (
        <TextField label="Manifest URL" fullWidth={true} defaultValue={session.manifestUrl} />
    );
}

export default InfoSection;