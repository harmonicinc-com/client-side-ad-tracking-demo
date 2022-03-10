export default interface ShakaPlayerProps {
    onError(err: ErrorEvent): void;
    onResume(): void;
    onPaused(): void;
    onMute(): void;
    onUnmute(): void;
    width?: number;
}
