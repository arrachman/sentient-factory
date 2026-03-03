import { describe, expect, it } from 'vitest';
import type { MenuConfig } from '@/config/types';
import { resolveSidebarSelectedValue } from './sidebar-menu-selection';

describe('resolveSidebarSelectedValue', () => {
  const baseMenus: MenuConfig = [
    {
      title: 'Dashboard',
      path: '/app/dashboard',
        children: [
          {
            title: 'Finance & Accounting',
            path: '/app/finance-accounting',
            children: [
              {
                title: 'Jurnal Penyesuaian (AJ)',
                path: '/app/finance-accounting/m2_aj',
              },
            ],
          },
        ],
    },
  ];

  it('selects exact finance child path', () => {
    const selected = resolveSidebarSelectedValue({
      menus: baseMenus,
      pathname: '/app/finance-accounting/m2_aj',
      currentQueryString: '',
    });

    expect(selected).toBe('/app/finance-accounting/m2_aj');
  });

  it('selects finance child query path for segment route when token matches', () => {
    const menus: MenuConfig = [
      {
        title: 'Dashboard',
        path: '/app/dashboard',
        children: [
          {
            title: 'Finance & Accounting',
            path: '/app/finance-accounting',
            children: [
              {
                title: 'Jurnal Penyesuaian (AJ)',
                path: '/app/finance-accounting?feature=m2_aj',
              },
            ],
          },
        ],
      },
    ];

    const selected = resolveSidebarSelectedValue({
      menus,
      pathname: '/app/finance-accounting/m2_aj',
      currentQueryString: '',
    });

    expect(selected).toBe('/app/finance-accounting?feature=m2_aj');
  });

  it('prefers child match over parent when both are compatible', () => {
    const menus: MenuConfig = [
      {
        title: 'Dashboard',
        path: '/app/dashboard',
        children: [
          {
            title: 'Finance & Accounting',
            path: '/app/finance-accounting',
            children: [
              {
                title: 'Jurnal Penyesuaian (AJ)',
                path: '/app/finance-accounting?feature=m2_aj',
              },
              {
                title: 'Kas Masuk (CR)',
                path: '/app/finance-accounting?feature=m2_cr',
              },
            ],
          },
        ],
      },
    ];

    const selected = resolveSidebarSelectedValue({
      menus,
      pathname: '/app/finance-accounting/m2_aj',
      currentQueryString: '',
    });

    expect(selected).toBe('/app/finance-accounting?feature=m2_aj');
  });

  it('can resolve by menu key token when path shape differs', () => {
    const menus: MenuConfig = [
      {
        key: 'dashboard',
        title: 'Dashboard',
        path: '/app/dashboard',
        children: [
          {
            key: 'finance-accounting',
            title: 'Finance & Accounting',
            path: '/app/finance-accounting',
            children: [
              {
                key: 'm2_aj',
                title: 'Jurnal Penyesuaian (AJ)',
                path: '/app/legacy/finance-aj',
              },
            ],
          },
        ],
      },
    ];

    const selected = resolveSidebarSelectedValue({
      menus,
      pathname: '/app/finance-accounting/m2_aj',
      currentQueryString: '',
    });

    expect(selected).toBe('/app/legacy/finance-aj');
  });
});
