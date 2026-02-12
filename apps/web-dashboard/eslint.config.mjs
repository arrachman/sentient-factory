import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  globalIgnores(['.next/**', 'node_modules/**', 'prisma/**']),
]);
