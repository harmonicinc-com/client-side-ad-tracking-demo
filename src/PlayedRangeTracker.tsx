type PlayedRange = { start: number; end: number };

export default class PlayedRangeTracker {
    private playedRanges: PlayedRange[] = [];
    private positionTrackingInterval = 500; // 0.5 second tolerance for continuity

    /**
     * Track a played position and merge ranges
     */
    trackPosition(position: number) {
        if (position < 0) return;

        if (this.playedRanges.length === 0) {
            // First range
            this.playedRanges.push({ start: position, end: position });
            return;
        }

        // Check if this position continues from or overlaps with any existing range
        let merged = false;
        for (let i = 0; i < this.playedRanges.length; i++) {
            const range = this.playedRanges[i];

            // Check if position extends or overlaps this range
            if (this.isPositionNearRange(position, range)) {
                // Extend the range
                if (position < range.start) {
                    range.start = position;
                } else if (position > range.end) {
                    range.end = position;
                }
                merged = true;

                // After extending, check if we can merge with adjacent ranges
                this.mergeAdjacentRanges();
                break;
            }
        }

        if (!merged) {
            // Position doesn't connect to any existing range - create new range
            this.playedRanges.push({ start: position, end: position });
            // Sort ranges by start time
            this.sortRanges();
            // Try to merge any adjacent ranges
            this.mergeAdjacentRanges();
        }
    }

    /**
     * Check if a position is near enough to a range to extend it
     */
    private isPositionNearRange(position: number, range: PlayedRange): boolean {
        // Position is near if it's within the range or within tolerance of the edges
        const tolerance = this.positionTrackingInterval * 2;
        return position >= range.start - tolerance && position <= range.end + tolerance;
    }

    /**
     * Merge overlapping or adjacent ranges
     */
    private mergeAdjacentRanges() {
        if (this.playedRanges.length <= 1) return;

        const merged: PlayedRange[] = [];
        let current = { ...this.playedRanges[0] };
        const tolerance = this.positionTrackingInterval * 2;

        for (let i = 1; i < this.playedRanges.length; i++) {
            const next = this.playedRanges[i];

            // Check if ranges overlap or are adjacent (within tolerance)
            if (current.end + tolerance >= next.start) {
                // Merge ranges
                current.end = Math.max(current.end, next.end);
                current.start = Math.min(current.start, next.start);
            } else {
                // No overlap, save current and move to next
                merged.push(current);
                current = { ...next };
            }
        }

        // Add the last range
        merged.push(current);
        this.playedRanges = merged;
    }

    /**
     * Sort ranges by start time
     */
    private sortRanges() {
        this.playedRanges.sort((a, b) => a.start - b.start);
    }

    /**
     * Check if a time point was played
     */
    wasTimePlayed(time: number): boolean {
        return this.playedRanges.some(range => time >= range.start && time <= range.end);
    }

    /**
     * Clean up old ranges beyond retention time
     */
    cleanupOldRanges(currentPosition: number, retentionSec: number) {
        this.playedRanges = this.playedRanges.filter(
            range => currentPosition - range.end < retentionSec
        );
    }

    /**
     * Get all played ranges
     */
    getRanges(): PlayedRange[] {
        return this.playedRanges;
    }

    /**
     * Clear all ranges
     */
    clearRanges() {
        this.playedRanges = [];
    }

    /**
     * Get count of ranges
     */
    getRangeCount(): number {
        return this.playedRanges.length;
    }
}
