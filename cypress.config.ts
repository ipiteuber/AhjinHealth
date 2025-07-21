import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'e2e/src/**/*.spec.ts',
    supportFile: 'e2e/support/e2e.ts',
  },
});
