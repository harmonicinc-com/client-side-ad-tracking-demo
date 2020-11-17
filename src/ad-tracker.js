class AdTracker {

    constructor(metadataUrl) {
        this.metadataUrl = metadataUrl;
        this.playing = false;
        this.adPods = [];
        this.lastPlayerTime = null;
    }

    async refreshMetadata() {
        const response = await fetch(this.metadataUrl);
        const json = await response.json();
        const pods = json.pods;
        if (pods) {
            this.mergePods(pods);
        }
    }

    mergePods(pods) {
        for (var i = this.adPods.length - 1; i >= 0; i--) {
            if (!pods.find(p => p.id === this.adPods[i].id)) {
                this.adPods.splice(i, 1);
            }
        }
        pods.forEach((pod) => {
            var existingPod = this.adPods.find(p => p.id === pod.id);
            if (!existingPod) {
                existingPod = {
                    id: pod.id,
                    start: pod.start,
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
        for (var i = pod.ads.length - 1; i >= 0; i--) {
            if (!ads.find(a => a.id === pod.ads[i].id)) {
                pod.ads.splice(i, 1);
            }
        }
        ads.forEach((ad) => {            
            var existingAd = pod.ads.find(a => a.id === ad.id);
            if (!existingAd) {
                existingAd = {
                    id: ad.id,
                    start: ad.start,
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

    start() {
        if (!this.playing) {
            this.playing = true;
        }
    }

    stop() {
        if (this.playing) {
            this.playing = false;
        }
    }

    updatePlayerTime(time) {
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

        this.adPods.forEach((pod) => {
            pod.ads.forEach((ad) => {
                ad.trackingUrls.forEach((trackingUrl) => {
                    if (trackingUrl.reportingState === "IDLE" && 
                        trackingUrl.startTime && time > trackingUrl.startTime &&
                        this.lastPlayerTime && trackingUrl.startTime > this.lastPlayerTime) {
                        sendBeacon(trackingUrl);
                    }
                });
            });
        });
        this.lastPlayerTime = time;
    }

    getAdPods() {
        return this.adPods;
    }

}

export default AdTracker;