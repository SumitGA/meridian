// .dependency-cruiser.js  (project root)
module.exports = {
  forbidden: [
    {
      name: 'shared-is-domain-blind',
      comment: 'shared/ may never know the domain. This rule is the architecture.',
      severity: 'error',
      from: { path: '^src/shared' },
      to: { path: '^src/(features|app)' },
    },
    {
      name: 'feature-public-api-only',
      severity: 'error',
      from: { path: '^src/features/([^/]+)/' },
      to: {
        path: '^src/features/([^/]+)/.+',
        pathNot: [
          '^src/features/$1/',              // own feature: anything
          '^src/features/[^/]+/index\\.ts$', // other features: barrel only
        ],
      },
    },
    {
      name: 'features-dont-know-app',
      severity: 'error',
      from: { path: '^src/features' },
      to: { path: '^src/app' },
    },
    {
      name: 'no-test-mocks-in-app-code',
      comment: 'MockConsentPage is a known temporary exception — delete with the mock.',
      severity: 'error',
      from: { path: '^src/(features|shared|app)', pathNot: 'MockConsentPage\\.tsx$' },
      to: { path: '^src/test' },
    },
    { name: 'no-cycles', severity: 'error', from: {}, to: { circular: true } },
    { name: 'no-orphans', severity: 'warn', from: { orphan: true }, to: {} },
  ],
  options: {
    tsConfig: { fileName: 'tsconfig.app.json' },
    tsPreCompilationDeps: true,
    doNotFollow: { path: 'node_modules' },
    exclude: { path: 'node_modules' },
  },
};