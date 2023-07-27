import React, {Component, createRef} from "react";
import "@harmonicinc/shaka-player/dist/controls.css";
import muxjs from 'mux.js';

import "@harmonicinc/shaka-player/dist/shaka-player.ui";
// @ts-ignore
import shaka from "@harmonicinc/shaka-player/dist/shaka-player.ui";
import ShakaPlayerInterface from "../types/ShakaPlayerInterface";
import ShakaPlayerProps from "../types/ShakaPlayerProps";

class ShakaPlayer extends Component<ShakaPlayerProps> implements ShakaPlayerInterface {
  player: shaka.Player | null;

  private readonly videoRef: React.RefObject<HTMLVideoElement>;
  private readonly containerRef: React.RefObject<HTMLDivElement>;
  private lastMuted: boolean;
  private paused: boolean;

  constructor(props: ShakaPlayerProps) {
    super(props);
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

    if (!video || !container) return;

    this.player = new shaka.Player(video);
    this.lastMuted = video.muted;

    if (!this.player) return;

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
      if (!ui.getControls()?.isSeeking()) {
        if (this.paused) {
          this.props.onResume?.();
          this.paused = false;
        }
      }
    });
    video.addEventListener('pause', () => {
      if (!ui.getControls()?.isSeeking()) {
        this.props.onPaused?.();
        this.paused = true;
      }
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

  configure(lowLatency: boolean) {
    if (lowLatency) {
      this.player?.configure('streaming.lowLatencyMode', true);
      this.player?.configure('abrFactory', () => new shaka.abr.SimpleLLAbrManager());
      this.player?.configure('streaming.liveCatchUp.enabled', true);
      this.player?.configure('streaming.liveCatchUp.targetLiveLatencyOverride', 6000);
      this.player?.configure('streaming.liveCatchUp.playbackRateMinOverride', 0);
      this.player?.configure('streaming.liveCatchUp.playbackRateMaxOverride', 0);
      this.player?.configure('manifest.defaultPresentationDelay', 0);
    } else {
      this.player?.configure('streaming.lowLatencyMode', false);
      this.player?.configure('streaming.liveCatchUp.enabled', false);
      this.player?.configure('streaming.liveCatchUp.targetLiveLatencyOverride', 0);
      this.player?.configure('streaming.liveCatchUp.playbackRateMinOverride', 1);
      this.player?.configure('streaming.liveCatchUp.playbackRateMaxOverride', 1);
      this.player?.configure('manifest.defaultPresentationDelay', 12.0 /* seconds */);
      this.player?.configure('manifest.dash.ignoreSuggestedPresentationDelay', true);
    }
  }

  load(url: string) {
    this.player?.load(url);
    this.paused = false;
  }

  unload() {
    this.player?.unload();
    this.paused = false;
  }

  getPlayheadTimeAsDate() {
    return this.player?.getPlayheadTimeAsDate() || null;
  }

  getSeekRange() {
    return this.player?.seekRange() || null;
  }

  getRawVideoTime() {
    return this.videoRef.current?.currentTime || null;
  }

  getPresentationLatencyInfo(): {type: string, latency: number, wallClock: Date} {
    return this.player?.getPresentationLatencyInfo() || null;
  }

  getPresentationStartTime(): Date {
    return this.player?.getPresentationStartTimeAsDate()
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
