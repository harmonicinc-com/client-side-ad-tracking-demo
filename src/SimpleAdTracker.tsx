import SimpleAdTrackerInterface from "../types/SimpleAdTrackerInterface";
import {Ad, AdBreak, TrackingEvent} from "../types/AdBeacon";

const AD_END_TRACKING_EVENT_TIME_TOLERANCE_MS = 500;
const MAX_TOLERANCE_IN_SPEED = 2;

const mergePods = (existingPods: AdBreak[], pods: AdBreak[]) => {
    let updated = false;

    for (let i = existingPods.length - 1; i >= 0; i--) {
        const podId = existingPods[i].id;
        if (!pods.find(p => p.id === podId)) {
            existingPods.splice(i, 1);
            updated = true;
        }
    }
    pods.forEach((pod) => {
        let existingPod = existingPods.find(p => p.id === pod.id);
        if (!existingPod) {
            existingPod = {
                id: pod.id,
                startTime: pod.prftStartTime || pod.startTime,
                duration: pod.duration,
                ads: []
            };
            existingPods.push(existingPod);
            updated = true;
        } else if (existingPod.duration !== pod.duration) {
            existingPod.duration = pod.duration;
            updated = true;
        }
        updated = mergeAds(existingPod.ads, pod.ads) || updated;
    });

    return updated;
}

const mergeAds = (existingAds: Ad[], ads: Ad[]) => {
    let updated = false;

    for (let i = existingAds.length - 1; i >= 0; i--) {
        const adId = existingAds[i].id;
        if (!ads.find(a => a.id === adId)) {
            existingAds.splice(i, 1);
            updated = true;
        }
    }
    ads.forEach((ad) => {
        let existingAd = existingAds.find(a => a.id === ad.id);
        if (!existingAd) {
            existingAd = {
                id: ad.id,
                startTime: ad.prftStartTime || ad.startTime,
                duration: ad.duration,
                trackingEvents: ad.trackingEvents.map(t => ({
                    event: t.event,
                    startTime: t.prftStartTime || t.startTime,
                    signalingUrls: t.signalingUrls,
                    reportingState: "IDLE"
                }))
            };
            existingAds.push(existingAd);
            updated = true;
        } else if (existingAd.duration !== ad.duration) {
            existingAd.duration = ad.duration;
            updated = true;
        }
    });

    return updated;
}

export default class SimpleAdTracker implements SimpleAdTrackerInterface {
    adPods: AdBreak[];
    lastPlayheadTime: number;
    private lastPlayheadUpdateTime: number;
    private listeners: (() => void)[];

    constructor() {
        this.adPods = [];
        this.lastPlayheadTime = 0;
        this.lastPlayheadUpdateTime = 0;
        this.listeners = [];
    }

    addUpdateListener(listener: () => void) {
        this.listeners.push(listener);
    }

    removeUpdateListener(listener: () => void) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    updatePods(pods: AdBreak[]) {
        const updated = mergePods(this.adPods, pods);
        if (updated) {
            this.notifyListeners();
        }
    }

    needSendBeacon(time: number, prft: boolean) {
        const now = new Date().getTime();
        if (this.lastPlayheadUpdateTime) {
            if (now === this.lastPlayheadUpdateTime) {
                return;
            }

            const speed = (time - this.lastPlayheadTime) / (now - this.lastPlayheadUpdateTime);
            if (speed > 0 && speed <= MAX_TOLERANCE_IN_SPEED) {
                this.iterateTrackingEvents((trackingUrl) => {
                    const startTime = prft ? trackingUrl.prftStartTime : trackingUrl.startTime;
                    if (startTime && trackingUrl.reportingState === "IDLE" &&
                        this.lastPlayheadTime < startTime && startTime <= time) {
                        this.sendBeacon(trackingUrl);
                    }
                }, this.lastPlayheadTime, time);
            }
        }
        this.lastPlayheadTime = time;
        this.lastPlayheadUpdateTime = now;
    }

    updatePlayheadTime(time: number) {
        this.needSendBeacon(time, false);
    }

    updatePrftPlayheadTime(time: number): void {
        this.needSendBeacon(time, true);
    }

    updateRawPlayheadTime(time: number): void {}

    getAdPods() {
        return this.adPods;
    }

    pause() {
        this.iterateTrackingEvents((trackingUrl) => {
            if (trackingUrl.event === "pause") {
                this.sendBeacon(trackingUrl);
            }
        });
    }

    resume() {
        this.iterateTrackingEvents((trackingUrl) => {
            if (trackingUrl.event === "resume") {
                this.sendBeacon(trackingUrl);
            }
        });
    }

    mute() {
        this.iterateTrackingEvents((trackingUrl) => {
            if (trackingUrl.event === "mute") {
                this.sendBeacon(trackingUrl);
            }
        });
    }

    unmute() {
        this.iterateTrackingEvents((trackingUrl) => {
            if (trackingUrl.event === "unmute") {
                this.sendBeacon(trackingUrl);
            }
        });
    }

    // private

    notifyListeners() {
        this.listeners.forEach((listener) => {
            listener();
        });
    };

    iterateTrackingEvents(handler: (a: TrackingEvent, b: Ad, c: AdBreak) => void, time0 = this.lastPlayheadTime, time1 = this.lastPlayheadTime, prft = false) {
        this.adPods.forEach((pod) => {
            const podStartTime = (prft ? pod.prftStartTime : pod.startTime) || 0;
            if (podStartTime <= time1 && time0 <= podStartTime + pod.duration + AD_END_TRACKING_EVENT_TIME_TOLERANCE_MS) {
                pod.ads.forEach((ad) => {
                    const adStartTime = (prft ? ad.prftStartTime : ad.startTime) || 0;
                    if (adStartTime <= time1 && time0 <= adStartTime + ad.duration + AD_END_TRACKING_EVENT_TIME_TOLERANCE_MS) {
                        ad.trackingEvents.forEach((trackingUrl) => {
                            handler(trackingUrl, ad, pod);
                        });
                    }
                });
            }
        });
    }

    async sendBeacon(trackingUrl: TrackingEvent) {
        trackingUrl.reportingState = "REPORTING";
        this.notifyListeners();

        try {
            let i = 0;
            for (const url of trackingUrl.signalingUrls) {
                const response = await fetch(url);
                if (response.status >= 200 && response.status <= 299) {
                    i++;
                } else {
                    console.error(`Failed to send beacon to ${url}; Status ${response.status}`);
                }
            }
            trackingUrl.reportingState = i === trackingUrl.signalingUrls.length ? "DONE" : "ERROR";
        } catch (err) {
            trackingUrl.reportingState = "ERROR";
        }
        this.notifyListeners();
    };
}
