const PORT = process.env.PORT || 3500

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    entry: './src/client/main.ts',
  },
  outputDir: 'dist/client',
  devServer: {
    proxy: `http://localhost:${PORT}`
  }
};
