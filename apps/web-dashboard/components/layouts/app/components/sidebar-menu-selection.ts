import type { MenuConfig } from '@/config/types';

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

type FlattenedMenuItem = {
  key?: string;
  title?: string;
  path: string;
};

function flattenMenuItems(items: MenuConfig): FlattenedMenuItem[] {
  const result: FlattenedMenuItem[] = [];
  for (const item of items) {
    if (item.path) {
      result.push({
        key: item.key,
        title: item.title,
        path: item.path,
      });
    }
    if (item.children?.length) {
      result.push(...flattenMenuItems(item.children));
    }
  }
  return result;
}

export function resolveSidebarSelectedValue(params: {
  menus: MenuConfig;
  pathname: string;
  currentQueryString: string;
}): string | undefined {
  const { menus, pathname, currentQueryString } = params;
  const menuItems = flattenMenuItems(menus);
  const currentParams = new URLSearchParams(currentQueryString);
  const currentPathTokens = tokenize(pathname);
  const currentLastSegmentTokens = tokenize(pathname.split('/').filter(Boolean).pop() ?? '');
  const currentQueryTokens = Array.from(currentParams.entries()).flatMap(
    ([key, value]) => [...tokenize(key), ...tokenize(value)],
  );
  const currentTokenSet = new Set([...currentPathTokens, ...currentQueryTokens]);

  let bestPath: string | undefined;
  let bestScore = -1;

  for (const menuItem of menuItems) {
    const menuPath = menuItem.path;
    const [pathOnly, queryString] = menuPath.split('?');
    const itemMetaTokens = [
      ...tokenize(menuItem.key ?? ''),
      ...tokenize(menuItem.title ?? ''),
      ...tokenize(menuPath),
    ];
    const matchedMetaTokens = itemMetaTokens.reduce(
      (acc, token) => acc + (currentTokenSet.has(token) ? 1 : 0),
      0,
    );
    const matchedLastSegmentTokens = itemMetaTokens.reduce(
      (acc, token) => acc + (currentLastSegmentTokens.includes(token) ? 1 : 0),
      0,
    );
    const fullLastSegmentMatch =
      currentLastSegmentTokens.length > 0 &&
      matchedLastSegmentTokens >= currentLastSegmentTokens.length;

    if (queryString) {
      const pathMatchesExactly = pathOnly === pathname;
      const pathMatchesNested =
        pathOnly.length > 1 && pathname.startsWith(`${pathOnly}/`);
      if (!pathMatchesExactly && !pathMatchesNested) {
        if (matchedMetaTokens === 0) {
          continue;
        }
      }

      const expectedParams = new URLSearchParams(queryString);
      let allParamsMatch = true;
      let matchedParams = 0;
      let matchedQueryTokens = 0;

      expectedParams.forEach((value, key) => {
        if (currentParams.get(key) === value) {
          matchedParams += 1;
        } else {
          allParamsMatch = false;
        }

        for (const token of [...tokenize(key), ...tokenize(value)]) {
          if (currentTokenSet.has(token)) {
            matchedQueryTokens += 1;
          }
        }
      });

      if (allParamsMatch) {
        const score =
          1400 +
          (pathMatchesExactly ? 50 : 0) +
          matchedParams * 20 +
          matchedMetaTokens * 5 +
          (fullLastSegmentMatch ? 250 : 0) +
          pathOnly.length;
        if (score > bestScore) {
          bestScore = score;
          bestPath = menuPath;
        }
        continue;
      }

      if (matchedQueryTokens === 0) {
        continue;
      }

      // Fallback for route-shape mismatch (e.g. menu uses query, page uses path segment).
      const score =
        1200 +
        (pathMatchesExactly ? 25 : 0) +
        matchedQueryTokens * 10 +
        matchedMetaTokens * 5 +
        matchedLastSegmentTokens * 10 +
        (fullLastSegmentMatch ? 300 : 0) +
        pathOnly.length;
      if (score > bestScore) {
        bestScore = score;
        bestPath = menuPath;
      }
      continue;
    }

    const samePath = pathOnly === pathname;
    const isNestedPath =
      pathOnly.length > 1 && pathname.startsWith(`${pathOnly}/`);
    if (!samePath && !isNestedPath && matchedMetaTokens === 0) {
      continue;
    }

    const score =
      (samePath ? 900 : isNestedPath ? 700 : 500) +
      matchedMetaTokens * 5 +
      matchedLastSegmentTokens * 10 +
      (fullLastSegmentMatch ? 300 : 0) +
      pathOnly.length;
    if (score > bestScore) {
      bestScore = score;
      bestPath = menuPath;
    }
  }

  return bestPath;
}
