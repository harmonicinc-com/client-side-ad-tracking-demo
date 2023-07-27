import {AdBreak} from "./AdBeacon";

export default interface SimpleAdTrackerInterface {
    adPods: AdBreak[];
    lastPlayheadTime: number;
    lastPrftPlayheadTime: number;
    presentationStartTime: number;
    metadataTimeRange: DataRange | null;
    updatePlayheadTime: (time: number) => void;
    updatePrftPlayheadTime: (time: number) => void;
    needSendBeacon: (time: number) => void;
    updatePresentationStartTime: (time: number) => void;
    updateLiveEdge: (liveEdge: number) => void;
    pause: () => (void | undefined);
    resume: () => (void | undefined);
    mute: () => (void | undefined);
    unmute: () => (void | undefined);
}
