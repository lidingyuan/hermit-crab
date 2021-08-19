module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/hermit-crab' : '/',
  outputDir: 'docs',
  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  }
}
