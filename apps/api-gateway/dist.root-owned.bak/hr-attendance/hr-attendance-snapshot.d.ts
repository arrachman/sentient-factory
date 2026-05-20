export declare function getAttendanceStorageBaseDir(): string;
export declare function resolveAttendanceSnapshotPath(snapshotUrl: string, baseDir: string): string;
export declare function persistSnapshot(bucket: string, prefix: string, dataUrl: string): Promise<string>;
