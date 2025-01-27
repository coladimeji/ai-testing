module.exports = {
  extension: ['ts'],
  spec: 'tests/**/*.mocha.ts',
  require: ['ts-node/register'],
  timeout: 30000,
  reporter: 'spec',
  ui: 'bdd',
  recursive: true,
  exit: true
}; 