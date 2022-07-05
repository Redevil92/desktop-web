const { defineConfig } = require("@vue/cli-service");
const MonacoWebpackPlugin = require("monaco-editor");

module.exports = defineConfig({
  transpileDependencies: true,
  plugins: [
    new MonacoEditorPlugin({
      // https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      // Include a subset of languages support
      // Some language extensions like typescript are so huge that may impact build performance
      // e.g. Build full languages support with webpack 4.0 takes over 80 seconds
      // Languages are loaded on demand at runtime
      languages: ["javascript", "css", "html", "typescript"],
      features: ["coreCommands", "find"],
      autolayout: true,
    }),
  ],
});
