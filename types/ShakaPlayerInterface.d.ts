import "@harmonicinc/shaka-player/dist/shaka-player.ui";

export default interface ShakaPlayerInterface {
    player: shaka.Player | null;
    getPlayheadTimeAsDate(): Date | null;
    getRawVideoTime(): number | null;
    load(url: string): void;
    unload(): void;
}
