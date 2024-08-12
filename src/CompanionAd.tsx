import { useContext, useState } from "react";
import { Ad, AdBreak } from "../types/AdBeacon";
import { Companion } from "../types/CompanionAds";
import AdTrackingContext from "./AdTrackingContext";
import useInterval from "./useInterval";

export default function CompanionAd() {
    const adTrackingContext = useContext(AdTrackingContext);
    if (adTrackingContext === undefined) {
      throw new Error('AdTrackingContext is undefined');
    }

    const pods = adTrackingContext.adPods || [];
    const playheadInMs = adTrackingContext.lastPlayheadTime;
    const [companionAdsToBeRendered, setCompanionAdsToBeRendered] = useState<{[key: string]: Companion}>({});

    const isOnAir = (o: AdBreak | Ad) => {
        const startTime = o.startTime;
        return startTime < playheadInMs && playheadInMs < startTime + o.duration
    }

    const updateLoop = () => {
        const newCompanionAdsToBeRendered: {[key: string]: Companion} = {};
        for (const pod of pods) {
            if (isOnAir(pod)) {
                // determine ad is in progress
                for (const ad of pod.ads) {
                    if (isOnAir(ad)) {
                        ad.companionAds.forEach((companionAd) => {
                            companionAd.companion.forEach((companion) => {
                                const key = `${pod.id}-${ad.id}-${companion.attributes.id}`
                                newCompanionAdsToBeRendered[key] = companion;
                            });
                        });
                    }
                }
            }
        }
        setCompanionAdsToBeRendered(newCompanionAdsToBeRendered);
    }

    const onImgClick = (ad: Companion) => {
        window.open(ad.companionClickThrough, "_blank");
        // no need to wait for the click tracking to finish
        fetch(ad.companionClickTracking);
    }   

    useInterval(updateLoop, 500);

    return (
        <div style={{position: "absolute"}}>
            {Object.values(companionAdsToBeRendered).map((companionAd) => (
                <div key={companionAd.attributes.id} style={{ 
                    zIndex: 999,
                    position: "absolute", 
                    top: `${companionAd.attributes.height}px`, 
                    left: `${companionAd.attributes.width}px`, 
                    width: `${companionAd.attributes.assetWidth}px`, 
                    height: `${companionAd.attributes.assetHeight}px`}}>
                        <button onClick={() => onImgClick(companionAd)} style={{ padding: 0, border: 'none', background: 'none' }}>
                            <img src={companionAd.staticResource} alt={companionAd.altText} />
                        </button>
                </div>
            ))}
        </div>
    )
}