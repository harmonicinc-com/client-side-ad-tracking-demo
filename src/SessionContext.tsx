import React from 'react';
import SessionContextInterface from "../types/SessionContextInterface";

const SessionContext = React.createContext<SessionContextInterface | undefined>(undefined);

export default SessionContext;
