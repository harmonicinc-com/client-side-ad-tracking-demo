const AD_END_TRACKING_EVENT_TIME_TOLERANCE_MS = 500;

const sendBeacon = async (trackingUrl) => {
    trackingUrl.reportingState = "REPORTING";

    try {
        const response = await fetch(trackingUrl.url);
        if (response.status >= 200 && response.status <= 299) {
            trackingUrl.reportingState = "DONE";
        } else {
            trackingUrl.reportingState = "ERROR";
        }
    } catch (err) {
        trackingUrl.reportingState = "ERROR";
    }
};

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

class AdTracker {

    constructor() {
        this.adPods = [];
        this.lastPlayerTime = null;
    }

    updatePods(pods) {
        this.mergePods(pods);
    }

    mergePods(pods) {
        for (let i = this.adPods.length - 1; i >= 0; i--) {
            const podId = this.adPods[i].id;
            if (!pods.find(p => p.id === podId)) {
                this.adPods.splice(i, 1);
            }
        }
        pods.forEach((pod) => {
            let existingPod = this.adPods.find(p => p.id === pod.id);
            if (!existingPod) {
                existingPod = {
                    id: pod.id,
                    startTime: pod.startTime,
                    duration: pod.duration,
                    ads: []
                };
                this.adPods.push(existingPod);
            } else {
                existingPod.duration = pod.duration;
            }
            this.mergeAds(existingPod, pod.ads);
        });
    }

    mergeAds(pod, ads) {
        for (let i = pod.ads.length - 1; i >= 0; i--) {
            const adId = pod.ads[i].id;
            if (!ads.find(a => a.id === adId)) {
                pod.ads.splice(i, 1);
            }
        }
        ads.forEach((ad) => {            
            let existingAd = pod.ads.find(a => a.id === ad.id);
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
                pod.ads.push(existingAd);
            } else {
                existingAd.duration = ad.duration;
            }
        });
    }

    updatePlayerTime(time) {
        walkTrackingEvents(this.adPods, time, (trackingUrl, ad, pod) => {
            if (trackingUrl.reportingState === "IDLE" && 
                trackingUrl.startTime && time > trackingUrl.startTime &&
                this.lastPlayerTime && trackingUrl.startTime > this.lastPlayerTime) {
                sendBeacon(trackingUrl);
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
                sendBeacon(trackingUrl);
            }
        });
    }

    resume() {
        walkTrackingEvents(this.adPods, this.lastPlayerTime, (trackingUrl) => {
            if (trackingUrl.event === "resume") {
                sendBeacon(trackingUrl);
            }
        });
    }

    mute() {
        walkTrackingEvents(this.adPods, this.lastPlayerTime, (trackingUrl) => {
            if (trackingUrl.event === "mute") {
                sendBeacon(trackingUrl);
            }
        });
    }

    unmute() {
        walkTrackingEvents(this.adPods, this.lastPlayerTime, (trackingUrl) => {
            if (trackingUrl.event === "unmute") {
                sendBeacon(trackingUrl);
            }
        });
    }

}

export default AdTracker;