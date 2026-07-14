import * as React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DateRangePicker } from '@/components/ui/date-range-picker';

vi.mock('@/lib/api/date-format', () => ({
  getDateFormat: vi.fn().mockResolvedValue({ format: 'DD/MM/YYYY', example: '31/01/2026' }),
}));

/**
 * Controlled harness — mirrors currencies-rates form state so selection
 * round-trips through props (same path as production).
 */
function Harness() {
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  return (
    <div>
      <DateRangePicker
        from={from}
        to={to}
        onChangeFrom={setFrom}
        onChangeTo={setTo}
      />
      <div data-testid="from">{from}</div>
      <div data-testid="to">{to}</div>
    </div>
  );
}

function openCalendar() {
  fireEvent.click(screen.getByTitle('Buka kalender'));
}

function dayButtons(): HTMLElement[] {
  // rdp v9: class "rdp-day_button" (UI.DayButton = "day_button")
  return Array.from(
    document.querySelectorAll('button.rdp-day_button'),
  ) as HTMLElement[];
}

function enabledDays(): HTMLElement[] {
  return dayButtons().filter((b) => !b.hasAttribute('disabled') && !b.getAttribute('aria-disabled'));
}

describe('DateRangePicker range UX', () => {
  beforeEach(() => {
    // Ensure a stable portal host for Radix
    document.body.innerHTML = '';
  });

  it('keeps popover open after start date; closes after end date', async () => {
    render(<Harness />);
    openCalendar();

    await waitFor(() => {
      expect(enabledDays().length).toBeGreaterThan(10);
    });

    const days = enabledDays();
    const start = days[5];
    const end = days[10];
    expect(start).toBeTruthy();
    expect(end).toBeTruthy();
    expect(start).not.toBe(end);

    fireEvent.click(start);

    // Start committed, end still empty, calendar still open
    await waitFor(() => {
      expect(screen.getByTestId('from').textContent).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
    expect(screen.getByTestId('to').textContent).toBe('');
    expect(enabledDays().length).toBeGreaterThan(0);

    fireEvent.click(end);

    await waitFor(() => {
      expect(screen.getByTestId('to').textContent).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
    // Popover closes once both ends are set
    await waitFor(() => {
      expect(dayButtons().length).toBe(0);
    });
  });

  it('allows same-day range on second click of the start date', async () => {
    render(<Harness />);
    openCalendar();
    await waitFor(() => expect(enabledDays().length).toBeGreaterThan(10));

    const day = enabledDays()[5];
    fireEvent.click(day);
    await waitFor(() => {
      expect(screen.getByTestId('from').textContent).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
    expect(screen.getByTestId('to').textContent).toBe('');

    fireEvent.click(day);
    await waitFor(() => {
      expect(screen.getByTestId('to').textContent).toBe(
        screen.getByTestId('from').textContent,
      );
    });
  });
});
