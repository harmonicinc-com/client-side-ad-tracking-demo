import { createRef, Component } from "react";
import "shaka-player/dist/controls.css";
import shaka from "shaka-player/dist/shaka-player.ui.js";
import muxjs from 'mux.js';

class ShakaPlayer extends Component {
  constructor() {
    super();
    this.videoRef = createRef();
    this.containerRef = createRef();
    this.player = null;
    this.lastMuted = false;
    this.paused = false;
  }

  componentDidMount() {
    window.muxjs = muxjs;

    const video = this.videoRef.current;
    const container = this.containerRef.current;

    this.player = new shaka.Player(video);
    this.player.configure('manifest.defaultPresentationDelay', 12.0 /* seconds */);
    this.player.configure('manifest.dash.ignoreSuggestedPresentationDelay', true);
    this.lastMuted = video.muted;

    const ui = new shaka.ui.Overlay(this.player, container, video);
    ui.configure({
      controlPanelElements: [
        "play_pause",
        "mute",
        "volume",
        "fullscreen",
        "overflow_menu"
      ]
    });

    video.addEventListener('error', (err) => this.props.onError?.(err));
    video.addEventListener('playing', () => {
      if (this.paused) {
        this.props.onResume?.();
        this.paused = false;
      }
    });
    video.addEventListener('pause', () => {
      this.props.onPaused?.();
      this.paused = true;
    });
    video.addEventListener('volumechange', () => {
      if (video.muted && !this.lastMuted) {
        this.props.onMute?.();
      } else if (!video.muted && this.lastMuted) {
        this.props.onUnmute?.();
      }
      this.lastMuted = video.muted;
    });
  }

  load(url) {
    this.player.load(url);
    this.paused = false;
  }

  unload() {
    this.player.unload();
    this.paused = false;
  }

  getPlayheadTimeAsDate() {
    return this.player.getPlayheadTimeAsDate();
  }

  getRawVideoTime() {
    return this.videoRef.current.currentTime;
  }

  render() {
    return (
      <div
        ref={this.containerRef}
        style={{ maxWidth: this.props.width }}>
        <video
            data-shaka-player
            ref={this.videoRef}
            style={{ width: "100%", height: "100%", backgroundColor: "black" }}
            autoPlay={true}>
        </video>
      </div>
    );
  }
}

export default ShakaPlayer;
