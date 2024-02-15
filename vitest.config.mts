import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    // exclude playwright files
    exclude: [
      ...configDefaults.exclude,
      '**/*.pw.spec.tsx'
    ],
    globals: true, // otherwise cleanup() needs to be called after each test: https://github.com/testing-library/vue-testing-library/issues/296
  },
});