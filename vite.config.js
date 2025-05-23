import { build, defineConfig } from 'vite';

export default defineConfig({
  base: '',
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
