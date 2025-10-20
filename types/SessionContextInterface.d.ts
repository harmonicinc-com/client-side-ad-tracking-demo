export default interface SessionContextInterface {
    sessionInfo: {
        localSessionId: string,
        mediaUrl: string | null,
        lowLatencyMode: boolean,
        initRequest: boolean,
        manifestUrl: string | null,
        adTrackingMetadataUrl: string | null,
        podRetentionMinutes: number,
        metadataRefreshIntervalMs: number
    },
    presentationStartTime: number | null,
    load: (url: any, lowLatency: boolean, initRequest: boolean, podRetentionMinutes: number, metadataRefreshIntervalMs: number) => Promise<void>,
    unload: () => void
}
