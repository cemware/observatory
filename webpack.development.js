const dotenv = require('dotenv').config({ path: '.env.development' });
if (dotenv.error) throw dotenv.error;

const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const kill = require('tree-kill');


const { pid } = process;
process.on('SIGINT', () => {
  kill(pid, 'SIGKILL');
});

module.exports = merge.merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  entry: {
    main: './src/index.ts',
  },
  devServer: {
    contentBase: './public',
    clientLogLevel: 'info',
    port: 9901,
    hot: false,
    host: '0.0.0.0',
    disableHostCheck: true,
  },
});
