import * as React from "react";
import "shaka-player/dist/controls.css";
import shaka from "shaka-player/dist/shaka-player.ui.js";
import muxjs from 'mux.js';

const initPlayer = async (pVideoRef) => {
    const ui = pVideoRef["ui"];
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
    const controls = ui.getControls();
    const player = controls.getPlayer();
    player.configure('manifest.defaultPresentationDelay', 20.0 /* seconds */);
    player.configure('manifest.availabilityWindowOverride', 45.0);
    player.addEventListener("error", onError);
    controls.addEventListener("error", onError);
    try {
    //   await player.load("https://acheung-desktop.nebula.video:20212/variant/v1/dai/DASH/Live/channel(clear)/manifest.mpd");
      await player.load("https://acheung-desktop.nebula.video:20212/Content/HLS/Live/channel(clear)/index.m3u8");
      console.log("The video has now been loaded!");
    } catch (err) {
      console.log("TCL: err", err);
      onError(err);
    }
};
  
const onError = (event: any) =>
  console.error("Error code", event);

function PlayerWrapper(props) {
  const videoRef = React.createRef();

  React.useEffect(() => {
    // document.addEventListener("shaka-ui-loaded", () =>
        window.muxjs = muxjs;
        initPlayer(videoRef.current)
    // );
  }, []);

  return (
    <div>
        <div
            data-shaka-player-container
            data-shaka-player-cast-receiver-id="7B25EC44"
            style={{ maxWidth: props.width }}>
            <video
                data-shaka-player
                ref={videoRef}
                style={{ width: "100%", height: "100%" }}
            ></video>
        </div>
    </div>
  );
}

export default PlayerWrapper;
