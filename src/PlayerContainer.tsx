import { useContext, useEffect, useRef, useState } from 'react';
import ShakaPlayer from './ShakaPlayer';
import SessionContext from './SessionContext';
import AdTrackingContext from './AdTrackingContext';
import useInterval from './useInterval';
import SessionContextInterface from "../types/SessionContextInterface";
import { DataRange } from '../types/AdBeacon';
import CompanionAd from './components/CompanionAd';

function PlayerContainer() {
    const sessionContext = useContext<SessionContextInterface | undefined>(SessionContext);

    if (sessionContext === undefined) {
        throw new Error('SessionContext is undefined');
    }

    const sessionInfo = sessionContext.sessionInfo;

    const adTrackingContext = useContext(AdTrackingContext);

    if (adTrackingContext === undefined) {
        throw new Error('SessionContext is undefined');
    }

    const shakaRef = useRef<ShakaPlayer>(null);

    const localSessionRef = useRef<any>();

    const [rawCurrentTime, setRawCurrentTime] = useState(0);
    const [playhead, setPlayhead] = useState(0);
    const [playheadInWallClock, setPlayheadInWallClock] = useState(0);
    const [prftWallClock, setPrftWallClock] = useState(0);
    const [latency, setLatency] = useState(NaN);
    const [metadataTimeRange, setMetadataTimeRange] = useState<DataRange | null>(null);

    const updateTime = (time: number) => {
        setRawCurrentTime(time);

        if (sessionInfo.manifestUrl?.includes(".m3u8")) {
            const clockTime = shakaRef.current?.getPlayheadTimeAsDate()?.getTime() || 0;
            setPlayhead(clockTime);
            setPlayheadInWallClock(clockTime);
            setMetadataTimeRange(adTrackingContext.metadataTimeRange);
            adTrackingContext.updatePlayheadTime(clockTime);
        } else if (sessionInfo.manifestUrl?.includes(".mpd")) {            
            const mediaTime = Math.round(time * 1000);
            const presentationStartTime = shakaRef.current?.getPresentationStartTime()?.getTime() || 0;
            const clockTime = presentationStartTime + mediaTime;
            const prftInfo = shakaRef.current?.getPresentationLatencyInfo()
            const prftClockTime = prftInfo?.wallClock.getTime() || 0;
            const latency = prftInfo?.latency || NaN;
            setPlayhead(mediaTime);
            setPlayheadInWallClock(clockTime);
            setPrftWallClock(prftClockTime);
            setLatency(latency);
            setMetadataTimeRange(adTrackingContext.metadataTimeRange);
            adTrackingContext.updatePlayheadTime(mediaTime);
            adTrackingContext.updatePresentationStartTime(presentationStartTime);
        }
    };

    const onError = (error: ErrorEvent) => {
      console.error("Error from player", error);
    }

    const timeMsToNextBreak = () => {
        return Math.min(Infinity, ...adTrackingContext.adPods
            .filter(p => p.startTime > playhead)
            .map(p => p.startTime))
            - playhead;
    }

    useInterval(() => {
        const time = shakaRef.current?.getRawVideoTime();
        if (time) updateTime(time);
    }, 500);

    useEffect(() => {
        if (shakaRef.current && localSessionRef.current !== sessionInfo.localSessionId) {
            if (sessionInfo.manifestUrl) {
                shakaRef.current.configure(sessionInfo.lowLatencyMode)
                shakaRef.current.load(sessionInfo.manifestUrl);
            } else {
                shakaRef.current.unload();
            }
            localSessionRef.current = sessionInfo.localSessionId
        }
    }, [shakaRef, sessionInfo]);

    return (
        <div>
            <ShakaPlayer ref={shakaRef}
                onPaused={() => {
                    console.log('playback paused');
                    adTrackingContext.pause();
                }}
                onResume={() =>{
                    console.log('playback resumed from pause');
                    adTrackingContext.resume()
                }}
                onMute={() => {
                    console.log('player muted');
                    adTrackingContext.mute();
                }}
                onUnmute={() => {
                    console.log('player unmute');
                    adTrackingContext.unmute();
                }}
                onError={onError}/>
            <CompanionAd adSlotId="0" />
            <div>
                Raw currentTime from video element: {rawCurrentTime ? rawCurrentTime.toFixed(1) : 0}s
            </div>
            <div>
                Playhead date time: {playheadInWallClock ? new Date(playheadInWallClock).toLocaleString() : '-'}
            </div>
            <div>
                PRFT Wall Clock: {prftWallClock ? new Date(prftWallClock).toLocaleString() : '-'}
            </div>
            <div>
                Latency: {!Number.isNaN(latency) ? latency + 's' : '-'}
            </div>
            <div>
                Ad metadata coverage: {metadataTimeRange ? ((metadataTimeRange.end - playhead) / 1000).toFixed(1) + 's beyond playhead' : '-'}
            </div>
            <div>
                Time to next ad break: {timeMsToNextBreak() !== Infinity ? Math.ceil(timeMsToNextBreak() /1000).toFixed(0) + 's' : '-'}
            </div>
        </div>
    );
}

export default PlayerContainer;
