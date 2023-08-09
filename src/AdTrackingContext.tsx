import React from 'react';
import AdTrackingContextInterface from '../types/AdTrackingContextInterface';

const AdTrackingContext = React.createContext<AdTrackingContextInterface | undefined>(undefined);

export default AdTrackingContext;
