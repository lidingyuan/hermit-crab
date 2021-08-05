module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/hermit-crab' : '/',
  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  }
}
