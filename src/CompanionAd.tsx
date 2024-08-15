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
    const [companionAdsToBeRendered, setCompanionAdsToBeRendered] = useState<{ [key: string]: Companion }>({});

    const isOnAir = (o: AdBreak | Ad) => {
        const startTime = o.startTime;
        return startTime < playheadInMs && playheadInMs < startTime + o.duration
    }

    const updateLoop = () => {
        const newCompanionAdsToBeRendered: { [key: string]: Companion } = {};
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

    const isFullscreen = () => {
        return document.fullscreenElement !== null;
    }

    useInterval(updateLoop, 500);

    return (
        <div>
            {Object.values(companionAdsToBeRendered).map((companionAd) => (
                // CompanionAd placement slot
                <div key={companionAd.attributes.id} style={{
                    width: `${companionAd.attributes.width}px`,
                    height: `${companionAd.attributes.height}px`,
                    backgroundColor: '#00000033',
                    display: 'flex',
                }}>
                    <div style={{
                        position: 'absolute',
                        height: 'inherit',
                        width: 'inherit',
                        alignContent: 'center',
                        userSelect: 'none',
                        color: '#00000044'
                    }}>
                        Companion ad slot
                    </div>
                    {/* CompanionAd */}
                    <button onClick={() => onImgClick(companionAd)} style={{
                        zIndex: 999,
                        padding: 0,
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        width: `${isFullscreen() ? companionAd.attributes.expandedWidth : companionAd.attributes.assetWidth}px`,
                        height: `${isFullscreen() ? companionAd.attributes.expandedHeight : companionAd.attributes.assetHeight}px`
                    }}>
                        <img src={companionAd.staticResource} alt={companionAd.altText} style={{
                            maxHeight: '100%',
                            maxWidth: '100%',
                        }} />
                    </button>
                </div>
            ))}
        </div>
    )
}