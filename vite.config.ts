import { configDefaults, defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    coverage: {
      exclude: [
        ...configDefaults.exclude,
        'generated/**', // ignora todo o conteúdo da pasta generated
        'node_modules/**',
        '**/*.spec.ts',
        '**/*.test.ts',
      ],
    },
  },
})
