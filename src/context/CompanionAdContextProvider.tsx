import React, { useContext, useMemo, useState } from 'react';
import { Ad, AdBreak } from "../../types/AdBeacon";
import { Companion } from "../../types/CompanionAds";
import AdTrackingContext from "../AdTrackingContext";
import useInterval from "../useInterval";
import CompanionAdContext from "./CompanionAdContext";

export default function CompanionAdContextProvider (props: Readonly<{ children: React.ReactNode }>) {
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
                                const key = `${pod.id}-${ad.id}-${companion.attributes.id}-${companion.attributes.adSlotId}`;
                                newCompanionAdsToBeRendered[key] = companion;
                            });
                        });
                    }
                }
            }
        }
        setCompanionAdsToBeRendered(newCompanionAdsToBeRendered);
    }
    
    useInterval(updateLoop, 500);

    const companionAdContext = useMemo(() => ({
        companionAdsToBeRendered,
    }), [companionAdsToBeRendered]);
    
    return (
        <CompanionAdContext.Provider value={companionAdContext}>
            {props.children}
        </CompanionAdContext.Provider>
    );
}