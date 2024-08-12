import { useContext } from "react";
import { Companion, CompanionAdProps } from "../../types/CompanionAds";
import CompanionAdContext from "../context/CompanionAdContext";

export default function CompanionAd(props: CompanionAdProps) {
    const companionAdContext = useContext(CompanionAdContext);
    if (companionAdContext === undefined) {
        throw new Error('CompanionAdContext is undefined');
    }

    const onImgClick = (ad: Companion) => {
        window.open(ad.companionClickThrough, "_blank");
        // no need to wait for the click tracking to finish
        fetch(ad.companionClickTracking);
    }

    const isFullscreen = () => {
        return document.fullscreenElement !== null;
    }

    return (
        <div>
            {Object.values(companionAdContext.companionAdsToBeRendered).map((companionAd) => {
                if (companionAd.attributes.adSlotId !== props.adSlotId) {
                    return null;
                }
                return (
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
                                // maxHeight: '100%',
                                // maxWidth: '100%',
                                width: '100%',
                            }} />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}