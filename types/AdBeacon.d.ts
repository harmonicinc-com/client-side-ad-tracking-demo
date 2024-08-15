import { CompanionAds } from "./CompanionAds";

export interface TrackingEvent {
    // event type
    event: "pause" | "resume" | "mute" | "unmute" | "start" | "impression" | "firstQuartile" | "midpoint" | "thirdQuartile" | "complete" | "createView"
    // time to fire beacon,
    startTime: number
    duration: number
    prftStartTime?: number
    // beacon url list
    signalingUrls: string[]
    reportingState?: string;
    isCompanionAd?: boolean;
}

export interface Ad {
    // Unique ID for the ad inserted
    id: string
    // Same as AdBreak
    startTime: number
    prftStartTime?: number
    // Inserted duration of the ad
    duration: number
    trackingEvents: TrackingEvent[]
    companionAds: CompanionAds[]
}

export interface AdBreak {
    // Unique ID for the Ad break
    id: string
    /**
     * Live
     *      HLS - program datetime of the beginning of ad break
     *      DASH - presentation time of the beginning of ad break
     *          presentationTime = (S@t - presentationTimeOffset) / timescale + periodStart
     *          https://github.com/google/shaka-player/blob/master/docs/design/dash-manifests.md#calculating-presentation-times
     *          Note that e.g. Shaka player does not provide API to get availabilityStartTime or
     *          ProducerReferenceTime
     * VOD
     *      HLS - duration from the beginning of the content
     *      DASH - presentation time of the beginning of ad break
     */
    startTime: number
    prftStartTime?: number
    // Ad break duration
    duration: number
    ads: Ad[]
}

export interface DataRange {
    start: number
    end: number
    prftStart?: number;
    prftEnd?: number;
}

export default interface AdBeacon {
    adBreaks: AdBreak[]
    dataRange: DataRange

}
