import {AdBreak} from "./AdBeacon";

export default interface AdTrackingContextInterface {
    adPods: AdBreak[]
    lastPlayheadTime: number
    presentationStartTime: number
    metadataTimeRange: DataRange | null
    updatePresentationStartTime: (time: number) => void
    updatePlayheadTime: (time: number) => void
    updateLiveEdge: (liveEdge: number) => void
    pause: () => void
    resume: () => void
    mute: () => void
    unmute: () => void
}
