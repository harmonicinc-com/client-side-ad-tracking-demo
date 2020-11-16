import React from 'react';
import Form from 'react-bootstrap/Form';
import { SessionContext } from './SessionService';

function InfoSection() {
    const session = React.useContext(SessionContext);

    return (
        <Form>
            <Form.Group controlId="formBasic">
                <Form.Label>Manifest URL</Form.Label>
                <Form.Control type="text" placeholder="Enter manifest URL" value={session.manifestUrl} />
            </Form.Group>
        </Form>
    );
}

export default InfoSection;