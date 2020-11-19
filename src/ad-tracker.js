const AD_END_TRACKING_EVENT_TIME_TOLERANCE_MS = 500;

const walkTrackingEvents = (pods, time, handler) => {
    pods.forEach((pod) => {
        if (pod.startTime <= time && time <= pod.startTime + pod.duration + AD_END_TRACKING_EVENT_TIME_TOLERANCE_MS) {
            pod.ads.forEach((ad) => {
                if (ad.startTime <= time && time <= ad.startTime + ad.duration + AD_END_TRACKING_EVENT_TIME_TOLERANCE_MS) {
                    ad.trackingUrls.forEach((trackingUrl) => {
                        handler(trackingUrl, ad, pod);
                    });
                }
            });
        }
    });
}

const mergePods = (existingPods, pods) => {
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

const mergeAds = (existingAds, ads) => {
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
                startTime: ad.startTime,
                duration: ad.duration,
                trackingUrls: ad.trackingUrls.map(t => ({
                    event: t.event,
                    startTime: t.startTime,
                    url: t.url,
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

class AdTracker {

    constructor() {
        this.adPods = [];
        this.lastPlayerTime = null;
        this.listeners = [];
        this.notifyListeners = () => {
            this.listeners.forEach((listener) => {
                listener();
            });
        };
        this.sendBeacon = async (trackingUrl) => {
            trackingUrl.reportingState = "REPORTING";
            this.notifyListeners();
        
            try {
                const response = await fetch(trackingUrl.url);
                if (response.status >= 200 && response.status <= 299) {
                    trackingUrl.reportingState = "DONE";
                } else {
                    trackingUrl.reportingState = "ERROR";
                }
                this.notifyListeners();
            } catch (err) {
                trackingUrl.reportingState = "ERROR";
                this.notifyListeners();
            }
        };
    }

    addUpdateListener(listener) {
        this.listeners.push(listener);
    }

    removeUpdateListener(listener) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    updatePods(pods) {
        const updated = mergePods(this.adPods, pods);
        if (updated) {
            this.notifyListeners();
        }
    }

    updatePlayerTime(time) {
        walkTrackingEvents(this.adPods, time, (trackingUrl, ad, pod) => {
            if (trackingUrl.reportingState === "IDLE" && 
                trackingUrl.startTime && time > trackingUrl.startTime &&
                this.lastPlayerTime && trackingUrl.startTime > this.lastPlayerTime) {
                this.sendBeacon(trackingUrl);
            }
        });
        this.lastPlayerTime = time;
    }

    getAdPods() {
        return this.adPods;
    }

    pause() {
        walkTrackingEvents(this.adPods, this.lastPlayerTime, (trackingUrl) => {
            if (trackingUrl.event === "pause") {
                this.sendBeacon(trackingUrl);
            }
        });
    }

    resume() {
        walkTrackingEvents(this.adPods, this.lastPlayerTime, (trackingUrl) => {
            if (trackingUrl.event === "resume") {
                this.sendBeacon(trackingUrl);
            }
        });
    }

    mute() {
        walkTrackingEvents(this.adPods, this.lastPlayerTime, (trackingUrl) => {
            if (trackingUrl.event === "mute") {
                this.sendBeacon(trackingUrl);
            }
        });
    }

    unmute() {
        walkTrackingEvents(this.adPods, this.lastPlayerTime, (trackingUrl) => {
            if (trackingUrl.event === "unmute") {
                this.sendBeacon(trackingUrl);
            }
        });
    }

}

export default AdTracker;