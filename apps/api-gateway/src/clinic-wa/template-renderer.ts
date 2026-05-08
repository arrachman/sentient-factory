/**
 * Simple Mustache-style template renderer.
 *
 * Replace `{{variable}}` placeholder dengan value dari variables map.
 * Tidak support conditionals, loops, atau partials (cukup untuk WA flat templates).
 *
 * Example:
 *   render("Hai {{nama}}, sesi {{tanggal}}", { nama: "Andi", tanggal: "2026-05-15" })
 *   → "Hai Andi, sesi 2026-05-15"
 *
 * Variable yang tidak ada di map: dibiarkan as-is (e.g., `{{missing}}`) untuk
 * memudahkan debug. Future enhancement: throw / log warning.
 */
export function renderTemplate(
  body: string,
  variables: Record<string, string | number | undefined | null> = {},
): string {
  return body.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const value = variables[key];
    if (value === undefined || value === null) return match;
    return String(value);
  });
}

/**
 * Extract list variabel yang dipakai di template (untuk validation di UI).
 * Example: extractVariables("Hai {{nama}}, sesi {{tanggal}}") → ["nama", "tanggal"]
 */
export function extractVariables(body: string): string[] {
  const matches = body.matchAll(/\{\{(\w+)\}\}/g);
  return Array.from(new Set([...matches].map((m) => m[1])));
}
