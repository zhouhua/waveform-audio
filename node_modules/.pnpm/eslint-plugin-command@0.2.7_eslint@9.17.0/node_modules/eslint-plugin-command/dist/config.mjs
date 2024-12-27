import { c as createPluginWithCommands, d as defaultPlugin } from './shared/eslint-plugin-command.BJeuqyvQ.mjs';
import './shared/eslint-plugin-command.CIQUzIgX.mjs';
import '@es-joy/jsdoccomment';

function config(options = {}) {
  const plugin = options.commands ? createPluginWithCommands(options) : defaultPlugin;
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

export { config as default };
