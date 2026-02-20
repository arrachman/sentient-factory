export function getTokenFromCookie() {
  return (
    document.cookie
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('sf_token='))
      ?.slice('sf_token='.length) || ''
  );
}

export function extractMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
