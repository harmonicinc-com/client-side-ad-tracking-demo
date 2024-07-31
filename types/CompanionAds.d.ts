import { TrackingEvent } from "./AdBeacon";

export interface CompanionAds {
    attributes: {
        required: boolean;
    };
    companion: Companion[];
}

export interface Companion {
    attributes: CompanionAttributes;
    staticResource: string;
    iFrameResource: string;
    htmlResource: string;
    adParameters: string;
    altText: string;
    companionClickThrough: string;
    companionClickTracking: string;
    trackingEvents: TrackingEvent[];
}

export interface CompanionAttributes {
    width: number;
    height: number;
    id: string;
    assetWidth: number;
    assetHeight: number;
    expandedWidth: number;
    expandedHeight: number;
    apiFramework: string;
    adSlotId: string;
    pxratio: number;
    renderingMode: string;
}