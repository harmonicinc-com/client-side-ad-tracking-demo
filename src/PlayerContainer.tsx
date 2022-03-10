import { useContext, useEffect, useRef, useState } from 'react';
import ShakaPlayer from './ShakaPlayer';
import SessionContext from './SessionContext';
import AdTrackingContext from './AdTrackingContext';
import useInterval from './useInterval';
import SessionContextInterface from "../types/SessionContextInterface";
import SimpleAdTrackerInterface from "../types/SimpleAdTrackerInterface";

function PlayerContainer() {
    const sessionContext = useContext<SessionContextInterface | undefined>(SessionContext);

    if (sessionContext === undefined) {
        throw new Error('SessionContext is undefined');
    }

    const sessionInfo = sessionContext.sessionInfo;

    const adTrackingContext = useContext<SimpleAdTrackerInterface | undefined>(AdTrackingContext);

    if (adTrackingContext === undefined) {
        throw new Error('SessionContext is undefined');
    }

    const shakaRef = useRef<ShakaPlayer>(null);

    const localSessionRef = useRef<any>();

    const [rawCurrentTime, setRawCurrentTime] = useState(0);

    const [playhead, setPlayhead] = useState(0);

    const updateTime = (time: number) => {
        setRawCurrentTime(time);

        if (sessionInfo.manifestUrl?.includes(".m3u8")) {
            const clockTime = shakaRef.current?.getPlayheadTimeAsDate()?.getTime() || 0;
            adTrackingContext.updateRawPlayheadTime(clockTime);
            adTrackingContext.updatePlayheadTime(clockTime);
            setPlayhead(clockTime);
        } else if (sessionInfo.manifestUrl?.includes(".mpd")) {
            const prftClockTime = shakaRef.current?.getPresentationLatencyInfo()?.wallClock.getTime() || 0;
            const clockTime = shakaRef.current?.getPlayheadTimeAsDate()?.getTime() || 0;
            adTrackingContext.updateRawPlayheadTime(time * 1000);
            adTrackingContext.updatePlayheadTime(clockTime);
            adTrackingContext.updatePrftPlayheadTime(prftClockTime);
            setPlayhead(clockTime);
        }
    };

    const onError = (error: ErrorEvent) => {
      console.error("Error from player", error);
    }

    const timeToNextBreak = Math.min(Infinity,
        ...adTrackingContext.adPods.filter(p => p.startTime > playhead).map(p => p.startTime)) - playhead;

    useInterval(() => {
        const time = shakaRef.current?.getRawVideoTime();
        if (time) updateTime(time);
    }, 500);

    useEffect(() => {
        if (shakaRef.current && localSessionRef.current !== sessionInfo.localSessionId) {
            if (sessionInfo.manifestUrl) {
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
            <div>
                Raw currentTime from video element: {rawCurrentTime ? rawCurrentTime.toFixed(0) : 0}s
            </div>
            <div>
                Playhead date time: {playhead ? new Date(playhead).toLocaleString() : '-'}
            </div>
            <div>
                Time to next ad break: {timeToNextBreak !== Infinity ? Math.ceil(timeToNextBreak/1000).toFixed(0) + 's' : '-'}
            </div>
        </div>
    );
}

export default PlayerContainer;
