'use strict';

const index = require('./shared/eslint-plugin-command.BgFUJkKB.cjs');
require('./shared/eslint-plugin-command.Cpe0-FJb.cjs');
require('@es-joy/jsdoccomment');

function config(options = {}) {
  const plugin = options.commands ? index.createPluginWithCommands(options) : index.defaultPlugin;
  const {
    name = "command"
  } = options;
  return {
    name,
    plugins: {
      [name]: plugin
    },
    rules: {
      [`${name}/command`]: "error"
    }
  };
}

module.exports = config;
