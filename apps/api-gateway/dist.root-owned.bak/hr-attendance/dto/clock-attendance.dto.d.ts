export declare class ClockAttendanceDto {
    latitude: number;
    longitude: number;
    faceScore?: number;
    livenessScore?: number;
    reasonCode?: string;
    snapshotDataUrl?: string;
    faceEmbedding?: number[];
    faceDetectionCount?: number;
    faceDetectionMode?: string;
    deviceInfo?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}
