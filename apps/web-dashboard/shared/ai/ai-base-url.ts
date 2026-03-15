const AI_ENGINE_FALLBACK_URL = 'http://ai-engine:8001';

export function getAiBaseUrl() {
  const candidates = [
    process.env.AI_ENGINE_URL,
    process.env.NEXT_PUBLIC_AI_ENGINE_URL,
    process.env.AI_ENGINE_BASE_URL,
  ];

  const configuredUrl = candidates.find((value) => typeof value === 'string' && value.trim().length > 0);

  return configuredUrl?.trim().replace(/\/$/, '') || AI_ENGINE_FALLBACK_URL;
}
