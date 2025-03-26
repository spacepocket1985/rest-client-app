import react from '@vitejs/plugin-react';
import { mergeConfig } from 'vite';
import { defineConfig as defineVitestConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default mergeConfig(
  defineVitestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/__tests__/setupTests.ts',
      coverage: {
        provider: 'istanbul',
        reporter: ['text', 'json', 'html'],
        include: ['**/*.tsx'],
        exclude: [
          '**/node_modules/**',
          '**/*.test.tsx',
          '**/*.spec.tsx',
          'src/__tests__/**',
          'src/__tests__/setupTests.ts',
          'src/types',
        ],
      },
    },
  }),
  {
    plugins: [react(), tsconfigPaths()],
  }
);
