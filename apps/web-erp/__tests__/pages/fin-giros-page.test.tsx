import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { emptyList, renderPage } from '../helpers/render-page';
import { createFeedbackMock } from '../helpers/feedback-mock';

const api = vi.hoisted(() => ({
  listGiros: vi.fn(),
  createGiro: vi.fn(),
  updateGiro: vi.fn(),
  deleteGiro: vi.fn(),
}));
vi.mock('@/lib/api/fin-giros', () => api);
vi.mock('@/lib/feedback', () => createFeedbackMock());

import { ErpGirosPage } from '@/components/pages/fin-giros-page';

describe('ErpGirosPage (smoke)', () => {
  it('renders title and calls listGiros', async () => {
    api.listGiros.mockResolvedValue(emptyList());
    renderPage(<ErpGirosPage />);
    expect(screen.getByText('Giros')).toBeInTheDocument();
    await waitFor(() => expect(api.listGiros).toHaveBeenCalled());
  });
});
