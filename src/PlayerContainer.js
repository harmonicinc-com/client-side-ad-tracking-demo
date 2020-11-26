import { useContext, useEffect, useRef, useState } from 'react';
import ShakaPlayer from './ShakaPlayer';
import SessionContext from './SessionContext';
import AdTrackingContext from './AdTrackingContext';
import useInterval from './useInterval';

function PlayerContainer() {
    const sessionContext = useContext(SessionContext);

    const sessionInfo = sessionContext.sessionInfo;

    const adTrackingContext = useContext(AdTrackingContext);

    const shakaRef = useRef();

    const localSessionRef = useRef(); 

    const [rawCurrentTime, setRawCurrentTime] = useState(0);

    const [playhead, setPlayhead] = useState(null);

    const updateTime = (time) => {
        setRawCurrentTime(time);

        if (sessionInfo.manifestUrl?.includes(".m3u8")) {
            const clockTime = shakaRef.current.getPlayheadTimeAsDate()?.getTime() || 0;
            adTrackingContext.updatePlayheadTime(clockTime);
            setPlayhead(clockTime);
        } else if (sessionInfo.manifestUrl?.includes(".mpd")) {
            const clockTime = sessionContext.presentationStartTime + time * 1000;
            adTrackingContext.updatePlayheadTime(clockTime);
            setPlayhead(clockTime);
        }
    };

    const onError = (error) => {
      console.error("Error from player", error);
    }

    const timeToNextBreak = Math.min(Infinity,
        ...adTrackingContext.adPods.filter(p => p.startTime > playhead).map(p => p.startTime)) - playhead;

    useInterval(() => {
        const time = shakaRef.current.getRawVideoTime();
        updateTime(time);
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
                Raw currentTime from video element: {rawCurrentTime.toFixed(0)}s
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
