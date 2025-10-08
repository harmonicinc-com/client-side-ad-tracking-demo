import {Ad, AdBreak, TrackingEvent} from "../types/AdBeacon";

const AD_END_TRACKING_EVENT_TIME_TOLERANCE_MS = 500;
const MAX_TOLERANCE_IN_SPEED = 2;
// Allow event to be emitted <tolerance> ms after its start time
// Used for events that have zero duration & PRFT source switching
const MAX_TOLERANCE_EVENT_END_TIME_MS = 1000;

const mergePods = (existingPods: AdBreak[], pods: AdBreak[], lastPlayheadTime: number, podRetentionMs: number) => {
    let updated = false;

    for (let i = existingPods.length - 1; i >= 0; i--) {
        const podEndTime = existingPods[i].startTime + existingPods[i].duration;
        const timeSincePodEnded = lastPlayheadTime - podEndTime;
        
        // Keep the pod if it hasn't ended yet or if it's within the expiration window
        const isPodActive = timeSincePodEnded < podRetentionMs;

        if (!isPodActive) {
            existingPods.splice(i, 1);
            updated = true;
        }
    }
    pods.forEach((pod) => {
        let existingPod = existingPods.find(p => p.id === pod.id);
        if (!existingPod) {
            existingPod = {
                id: pod.id,
                prftStartTime: pod.prftStartTime, // add for display purposes
                startTime: pod.startTime,
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

    ads.forEach((ad) => {
        let existingAd = existingAds.find(a => a.id === ad.id);
        if (!existingAd) {
            existingAd = {
                id: ad.id,
                prftStartTime: ad.prftStartTime, // add for display purposes
                startTime: ad.startTime,
                duration: ad.duration,
                trackingEvents: ad.trackingEvents.map(t => ({
                    event: t.event,
                    prftStartTime: t.prftStartTime, // add for display purposes
                    startTime: t.startTime,
                    duration: t.duration,
                    signalingUrls: t.signalingUrls,
                    reportingState: "IDLE"
                })),
                companionAds: ad.companionAds?.map(c => ({
                    ...c,
                    companion: c.companion.map(d => ({
                        ...d,
                        trackingEvents: d.trackingEvents.map(e => ({
                            ...e,
                            reportingState: "IDLE"
                        }))
                    }))
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

export default class SimpleAdTracker {
    private adPods: AdBreak[];
    private lastPlayheadTime: number;
    private lastPlayheadUpdateTime: number;
    private listeners: (() => void)[];
    private companionAdListener: ((ad: Ad) => void);
    private podRetentionMinutes: number;

    constructor() {
        this.adPods = [];
        this.lastPlayheadTime = 0;
        this.lastPlayheadUpdateTime = 0;
        this.listeners = [];
        this.companionAdListener = () => {};
        this.podRetentionMinutes = 120; // Default: 2 hours
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

    setCompanionAdListener(listener: (ad: Ad) => void) {
        this.companionAdListener = listener;
    }

    setPodRetentionMinutes(minutes: number) {
        this.podRetentionMinutes = minutes;
    }

    updatePods(pods: AdBreak[]) {
        const podRetentionMs = this.podRetentionMinutes * 60 * 1000;
        const updated = mergePods(this.adPods, pods, this.lastPlayheadTime, podRetentionMs);
        if (updated) {
            this.notifyListeners();
        }
    }

    updatePlayheadTime(time: number) {
        const now = new Date().getTime();
        if (this.lastPlayheadUpdateTime) {
            if (now === this.lastPlayheadUpdateTime) {
                return;
            }

            const speed = (time - this.lastPlayheadTime) / (now - this.lastPlayheadUpdateTime);
            if (speed > 0 && speed <= MAX_TOLERANCE_IN_SPEED) {
                this.iterateTrackingEvents((trackingUrl) => {
                    const startTime = trackingUrl.startTime;
                    const endTime = startTime + (trackingUrl.duration || MAX_TOLERANCE_EVENT_END_TIME_MS);
                    if (trackingUrl.reportingState === "IDLE" &&
                        startTime <= time && time <= endTime
                    ) {
                        this.sendBeacon(trackingUrl);
                    }
                }, this.lastPlayheadTime, time);
            }
        }
        this.lastPlayheadTime = time;
        this.lastPlayheadUpdateTime = now;
    }

    getAdPods(): AdBreak[] {
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

    private notifyListeners() {
        this.listeners.forEach((listener) => {
            listener();
        });
    };

    private iterateTrackingEvents(handler: (a: TrackingEvent) => void, time0 = this.lastPlayheadTime, time1 = this.lastPlayheadTime) {
        this.adPods.forEach((pod) => {
            const podStartTime = pod.startTime;
            if (podStartTime <= time1 && time0 <= podStartTime + pod.duration + AD_END_TRACKING_EVENT_TIME_TOLERANCE_MS) {
                pod.ads.forEach((ad) => {
                    const adStartTime = ad.startTime;
                    if (adStartTime <= time1 && time0 <= adStartTime + ad.duration + AD_END_TRACKING_EVENT_TIME_TOLERANCE_MS) {
                        ad.trackingEvents.forEach((trackingUrl) => {
                            handler(trackingUrl);
                        });
                        // extract this to a helper function
                        this.iterateCompanionAds(handler, ad);
                        this.companionAdListener(ad);
                    }
                });
            }
        });
    }

    private iterateCompanionAds(handler: (trackingUrl: TrackingEvent) => void, ad: Ad) {
        ad.companionAds?.forEach((companionAd) => {
            companionAd.companion.forEach((companion) => {
                companion.trackingEvents.forEach((trackingUrl) => {
                    handler(trackingUrl);
                });
            });
        });
    }


    private async sendBeacon(trackingUrl: TrackingEvent) {
        trackingUrl.reportingState = "REPORTING";
        this.notifyListeners();

        try {
            await Promise.all(trackingUrl.signalingUrls.map(async url => {
                const response = await fetch(url);
                if (response.status < 200 && response.status > 299) {
                    console.error(`Failed to send beacon to ${url}; Status ${response.status}`);
                    throw new Error(`Failed to send beacon to ${url}; Status ${response.status}`);
                }
            }))
            trackingUrl.reportingState = "DONE"
        } catch (err) {
            trackingUrl.reportingState = "ERROR";
        }
        this.notifyListeners();
    };
}
