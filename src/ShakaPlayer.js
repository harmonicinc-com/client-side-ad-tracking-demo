import * as React from "react";
import "shaka-player/dist/controls.css";
import shaka from "shaka-player/dist/shaka-player.ui.js";
import muxjs from 'mux.js';

const initPlayer = async (pVideoRef, src) => {
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
        await player.load(src);
      console.log("The video has now been loaded!");
    } catch (err) {
      console.log("TCL: err", err);
      onError(err);
    }
};
  
const onError = (event: any) =>
  console.error("Error code", event);

function ShakaPlayer(props) {
  const videoRef = React.createRef();

  React.useEffect(() => {
    // document.addEventListener("shaka-ui-loaded", () =>
        window.muxjs = muxjs;
        initPlayer(videoRef.current, props.src);
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

export default ShakaPlayer;
