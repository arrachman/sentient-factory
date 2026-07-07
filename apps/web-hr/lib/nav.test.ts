import { describe, it, expect } from 'vitest';
import { HR_NAV, HR_NAV_FLAT } from './nav';

describe('HR navigation model', () => {
  it('flattens all group items', () => {
    const grouped = HR_NAV.reduce((n, g) => n + g.items.length, 0);
    expect(HR_NAV_FLAT.length).toBe(grouped);
  });

  it('has unique keys and paths', () => {
    const keys = HR_NAV_FLAT.map((i) => i.key);
    const paths = HR_NAV_FLAT.map((i) => i.path);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('exposes the core attendance + settings screens as live', () => {
    const live = new Map(HR_NAV_FLAT.map((i) => [i.key, i.status]));
    expect(live.get('attendance')).toBe('live');
    expect(live.get('dashboard')).toBe('live');
    expect(live.get('settings')).toBe('live');
  });

  it('uses /app-prefixed routes', () => {
    expect(HR_NAV_FLAT.every((i) => i.path.startsWith('/app/'))).toBe(true);
  });
});
