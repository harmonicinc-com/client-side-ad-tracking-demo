import {AdBreak} from "./AdBeacon";

export default interface SimpleAdTrackerInterface {
    adPods: AdBreak[];
    lastPlayheadTime: number;
    updatePlayheadTime: (time: number) => void;
    updatePrftPlayheadTime: (time: number) => void;
    updateRawPlayheadTime: (time: number) => void;
    pause: () => (void | undefined);
    resume: () => (void | undefined);
    mute: () => (void | undefined);
    unmute: () => (void | undefined);
}
