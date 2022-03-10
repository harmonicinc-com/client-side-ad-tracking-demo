import React from 'react';
import SimpleAdTrackerInterface from "../types/SimpleAdTrackerInterface";

const AdTrackingContext = React.createContext<SimpleAdTrackerInterface | undefined>(undefined);

export default AdTrackingContext;
