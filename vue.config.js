module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/hermit-crab' : '/',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  outputDir: 'docs',
  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  }
}
