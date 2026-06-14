export declare class CreateFaceEnrollmentDto {
    targetAppUserId?: number;
    qualityScore?: number;
    snapshotDataUrl?: string;
    faceEmbedding?: number[];
    faceDetectionCount?: number;
    livenessScore?: number;
    faceDetectionMode?: string;
    metadata?: Record<string, unknown>;
}
