import { useContext, useEffect, useRef } from 'react';
import ShakaPlayer from './ShakaPlayer';
import SessionContext from './SessionContext';
import AdTrackingContext from './AdTrackingContext';
import PlaybackContext from './PlaybackContext';

function PlayerContainer() {
    const sessionContext = useContext(SessionContext);

    const sessionInfo = sessionContext.sessionInfo;

    const playbackContext = useContext(PlaybackContext);

    const adTrackingContext = useContext(AdTrackingContext);

    const shakaRef = useRef();

    const localSessionRef = useRef(); 

    const updateTime = (time) => {
        playbackContext.updatePlayerTime(time);
        adTrackingContext.updatePlayerTime(sessionContext.presentationStartTime + time * 1000);
    };

    const onError = (error) => {
      console.error("Error from player", error);
    }

    const playhead = sessionContext.presentationStartTime ? sessionContext.presentationStartTime + playbackContext.currentTime * 1000 : null;

    const timeToNextBreak = Math.min(Infinity,
        ...adTrackingContext.adPods.filter(p => p.startTime > playhead).map(p => p.startTime)) - playhead;

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
                onTimeUpdate={updateTime}
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
                Raw currentTime from video element: {playbackContext.currentTime.toFixed(1)}s
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
