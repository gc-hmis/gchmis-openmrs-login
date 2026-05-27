const baseConfig = require('openmrs/default-webpack-config');

module.exports = (env, argv) => {
  const config = baseConfig(env, argv);

  // The published OpenMRS packages expose TypeScript source. In a standalone
  // repo, the dev type-checker reports upstream package errors from node_modules
  // before the local login page can run. SWC still transpiles the app for dev.
  config.plugins = config.plugins.filter((plugin) => plugin?.constructor?.name !== 'ForkTsCheckerWebpackPlugin');
  config.watchOptions = {
    ...config.watchOptions,
    ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
  };

  return config;
};
