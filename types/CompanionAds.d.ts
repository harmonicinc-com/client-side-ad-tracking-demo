import { TrackingEvent } from "./AdBeacon";

export interface ICompanionAdContext {
    companionAdsToBeRendered: { [key: string]: Companion };
}

export interface CompanionAdProps {
    adSlotId: string;
}

export interface CompanionAds {
    attributes: {
        required: "all" | "any" | "none";
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