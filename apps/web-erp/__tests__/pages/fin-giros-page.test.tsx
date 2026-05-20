import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { emptyList, renderPage } from '../helpers/render-page';
import { createFeedbackMock } from '../helpers/feedback-mock';

// Smoke test for Receipt Giro page (split from former Giros page in
// 2026-05-20 M2 finance scaffold — see web-erp CLAUDE.md §2.17).
const api = vi.hoisted(() => ({
  listReceiptGiros: vi.fn(),
  createReceiptGiro: vi.fn(),
  updateReceiptGiro: vi.fn(),
  deleteReceiptGiro: vi.fn(),
}));
vi.mock('@/lib/api/fin-receipt-giros', () => api);
vi.mock('@/lib/feedback', () => createFeedbackMock());

import { ErpReceiptGirosPage } from '@/components/pages/fin-receipt-giros-page';

describe('ErpReceiptGirosPage (smoke)', () => {
  it('renders title and calls listReceiptGiros', async () => {
    api.listReceiptGiros.mockResolvedValue(emptyList());
    renderPage(<ErpReceiptGirosPage />);
    expect(screen.getByText('Receipt Giro')).toBeInTheDocument();
    await waitFor(() => expect(api.listReceiptGiros).toHaveBeenCalled());
  });
});
