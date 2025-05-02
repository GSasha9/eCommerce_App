import { defineConfig } from 'vite';

export default defineConfig({
  base: '',
  root: 'ecommerce-application',
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
