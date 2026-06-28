// HR Face Enrollments — /api/hr/face-enrollments
import { apiGet, apiPost, buildApiUrl } from './client';

export interface FaceEnrollment {
  appUserId: string;
  name: string;
  employeeCode?: string | null;
  activeEnrollmentId?: string | null;
  enrollmentStatus?: string;
  enrolledAt?: string | null;
  [key: string]: unknown;
}

export interface CreateFaceEnrollmentPayload {
  /** Omit for self-enrollment; set to enroll on behalf of another user (admin). */
  targetAppUserId?: number;
  snapshotDataUrl?: string;
  qualityScore?: number;
  livenessScore?: number;
  faceEmbedding?: number[];
  faceDetectionCount?: number;
  faceDetectionMode?: string;
  metadata?: Record<string, unknown>;
}

export async function createFaceEnrollment(
  payload: CreateFaceEnrollmentPayload,
): Promise<Record<string, unknown>> {
  return apiPost('/hr/face-enrollment', payload);
}

export async function listFaceEnrollments(): Promise<
  FaceEnrollment[] | { data: FaceEnrollment[] }
> {
  return apiGet('/hr/face-enrollments');
}

/** Same-origin URL for an enrollment snapshot image (rendered in <img src>). */
export function faceEnrollmentSnapshotUrl(enrollmentId: string): string {
  return buildApiUrl(`/hr/face-enrollments/${enrollmentId}/snapshot`);
}

/** Same-origin URL for an attendance event snapshot image. */
export function attendanceEventSnapshotUrl(eventId: string): string {
  return buildApiUrl(`/hr/events/${eventId}/snapshot`);
}
