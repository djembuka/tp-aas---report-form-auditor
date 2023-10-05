module.exports = {
  filenameHashing: false,
  /*configureWebpack: {
    output: {
      filename: 'script_ext.js',
      chunkFilename: 'chunk-vendors.js',
    },
  },*/
  css: {
    extract: {
      filename: 'css/style_ext.css',
      chunkFilename: 'css/chunk-vendors.css',
    },
  },
};
