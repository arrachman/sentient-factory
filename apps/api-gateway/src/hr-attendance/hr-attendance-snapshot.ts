import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import * as path from 'path';

export function getAttendanceStorageBaseDir() {
  return (
    process.env.HR_ATTENDANCE_STORAGE_PATH ||
    path.resolve(process.cwd(), '../../temp/hr-attendance')
  );
}

export function resolveAttendanceSnapshotPath(snapshotUrl: string, baseDir: string) {
  if (snapshotUrl.startsWith('/temp/hr-attendance/')) {
    return path.join(baseDir, snapshotUrl.replace('/temp/hr-attendance/', ''));
  }

  return path.resolve(snapshotUrl);
}

export async function persistSnapshot(bucket: string, prefix: string, dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new BadRequestException('Snapshot data URL is invalid.');
  }

  const mimeType = match[1];
  const base64 = match[2];
  const extension = mimeType.includes('png') ? 'png' : 'jpg';
  const fileName = `${prefix}-${Date.now()}-${randomUUID()}.${extension}`;
  const baseDir = getAttendanceStorageBaseDir();
  const targetDir = path.join(baseDir, bucket);

  await mkdir(targetDir, { recursive: true });

  const filePath = path.join(targetDir, fileName);
  await writeFile(filePath, Buffer.from(base64, 'base64'));

  return filePath;
}
