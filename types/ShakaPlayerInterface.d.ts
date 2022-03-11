import "@harmonicinc/shaka-player/dist/shaka-player.ui";

export default interface ShakaPlayerInterface {
    player: shaka.Player | null;
    getPlayheadTimeAsDate(): Date | null;
    getRawVideoTime(): number | null;
    getPresentationLatencyInfo(): {type: string, latency: number, wallClock: Date};
    getPresentationStartTime(): Date;
    load(url: string): void;
    unload(): void;
}
