export default interface SessionContextInterface {
    sessionInfo: {
        localSessionId: string,
        mediaUrl: string | null,
        lowLatencyMode: boolean,
        manifestUrl: string | null,
        adTrackingMetadataUrl: string | null
    },
    presentationStartTime: number | null,
    load: (url: any, lowLatency: boolean) => Promise<void>,
    unload: () => void
}
