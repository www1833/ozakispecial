import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = process.env.GITHUB_REPOSITORY?.split('/').pop();

export default defineConfig({
  plugins: [react()],
  base: repoName ? `/${repoName}/` : './',
});
