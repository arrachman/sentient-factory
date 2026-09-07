import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns an ok status', () => {
    const result = new HealthController().getHealth();
    expect(result.status).toBe('ok');
    expect(result.service).toBe('nuha-api');
  });
});
