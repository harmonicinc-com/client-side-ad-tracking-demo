export default interface SessionContextInterface {
    sessionInfo: {
        localSessionId: string,
        mediaUrl: string | null,
        manifestUrl: string | null,
        adTrackingMetadataUrl: string | null
    },
    presentationStartTime: number | null,
    load: (url: any) => Promise<void>,
    unload: () => void
}
