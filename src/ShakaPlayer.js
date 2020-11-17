import * as React from "react";
import "shaka-player/dist/controls.css";
import shaka from "shaka-player/dist/shaka-player.ui.js";
import muxjs from 'mux.js';

const initPlayer = async (pVideoRef, containerRef, props) => {
    const player = new shaka.Player(pVideoRef);
    const ui = new shaka.ui.Overlay(player, containerRef, pVideoRef);
    const config = {
      controlPanelElements: [
        "rewind",
        "play_pause",
        "fast_forward",
        "time_and_duration",
        "mute",
        "volume",
        "fullscreen",
        "overflow_menu"
      ]
    };
    ui.configure(config);
    ui.getControls();
    const controls = ui.getControls();

    player.configure('manifest.defaultPresentationDelay', 12.0 /* seconds */);
    player.configure('manifest.dash.ignoreSuggestedPresentationDelay', true);
    // player.configure('manifest.availabilityWindowOverride', 105.0);
    player.addEventListener("error", onError);
    if (props.onTimeUpdate) {
      pVideoRef.addEventListener('timeupdate', () => props.onTimeUpdate(pVideoRef.currentTime, pVideoRef, player));
    }
    if (props.onPlaying) {
      pVideoRef.addEventListener('playing', () => props.onPlaying());
    }
    if (props.onPaused) {
      pVideoRef.addEventListener('paused', () => props.onPaused());
    }
    controls.addEventListener("error", onError);
    try {
        await player.load(props.src);
      console.log("The video has now been loaded!");
    } catch (err) {
      console.log("TCL: err", err);
      onError(err);
    }
};
  
const onError = (event: any) =>
  console.error("Error code", event);

function ShakaPlayer(props) {
  const containerRef = React.createRef();
  const videoRef = React.createRef();

  React.useEffect(() => {
    window.muxjs = muxjs;
    // document.addEventListener("shaka-ui-loaded", () => {
    //   initPlayer(videoRef.current, props);
    // });
    initPlayer(videoRef.current, containerRef.current, props);
  }, []);

  return (
    <div>
        <div
            ref={containerRef}
            style={{ maxWidth: props.width }}>
            <video
                data-shaka-player
                ref={videoRef}
                style={{ width: "100%", height: "100%" }}
                autoPlay={true}
            ></video>
        </div>
    </div>
  );
}

export default ShakaPlayer;
