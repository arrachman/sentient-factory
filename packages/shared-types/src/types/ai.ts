import { AlertSeverity, BaseEntity } from './common';

export interface AiInsight extends BaseEntity {
  title: string;
  summary: string;
  severity: AlertSeverity;
  source?: string;
  recommendation?: string;
}

export interface PredictionResult {
  model: string;
  confidence: number;
  predictedAt: Date;
  payload: Record<string, unknown>;
}
