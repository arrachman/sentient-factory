export declare class ReportAttendanceFailureDto {
    eventType: string;
    reasonCode: string;
    latitude?: number;
    longitude?: number;
    faceScore?: number;
    livenessScore?: number;
    snapshotDataUrl?: string;
    deviceInfo?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}
