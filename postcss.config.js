module.exports = {
  // parser: 'postcss-less-parser',
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {
      warnForDuplicates: false,
    },
    'cssnano': {},
    'autoprefixer': {}
  }
}