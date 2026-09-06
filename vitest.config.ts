import { defineConfig } from 'vitest/config';

// Two seams (spec, issue #2): the CV sync against a fixture, and the built output in dist/.
export default defineConfig({
  test: {
    projects: [
      { test: { name: 'sync', include: ['tests/cv-sync.test.mjs'] } },
      { test: { name: 'build', include: ['tests/build.test.mjs'], testTimeout: 30000 } },
    ],
  },
});
