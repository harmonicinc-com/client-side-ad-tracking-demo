export default interface SessionContextInterface {
    sessionInfo: {
        localSessionId: string,
        mediaUrl: string | null,
        lowLatencyMode: boolean,
        initRequest: boolean,
        manifestUrl: string | null,
        adTrackingMetadataUrl: string | null
    },
    presentationStartTime: number | null,
    load: (url: any, lowLatency: boolean, initRequest: boolean) => Promise<void>,
    unload: () => void
}
