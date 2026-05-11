import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/**
 * Patch nextCoreWebVitals/nextTypescript rule severities in-place.
 * Flat-config plugins are scoped per config-object, so kita harus
 * override severity di config object yang sama dimana plugin di-load
 * (yaitu config blocks dari preset Next). Trick: walk hasil spread,
 * cari config object yang punya plugin `react-hooks`, lalu downgrade
 * rule severity. Same approach untuk @typescript-eslint.
 */
function patchSeverity(config, ruleName, level) {
  for (const block of config) {
    if (block?.plugins) {
      const ns = ruleName.split('/')[0];
      if (block.plugins[ns]) {
        block.rules = { ...(block.rules ?? {}), [ruleName]: level };
      }
    }
  }
  return config;
}

const patchedNextCore = patchSeverity(
  patchSeverity([...nextCoreWebVitals], 'react-hooks/set-state-in-effect', 'warn'),
  'react-hooks/exhaustive-deps',
  'warn',
);
const patchedNextTs = patchSeverity(
  [...nextTypescript],
  '@typescript-eslint/no-unused-vars',
  ['warn', { argsIgnorePattern: '^_|^err$', varsIgnorePattern: '^_' }],
);

export default defineConfig([
  ...patchedNextCore,
  ...patchedNextTs,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
  globalIgnores(['.next/**', 'node_modules/**', 'public/**']),
]);
