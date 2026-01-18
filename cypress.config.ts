import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    specPattern: 'src/**/*.test-cy.tsx',
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
