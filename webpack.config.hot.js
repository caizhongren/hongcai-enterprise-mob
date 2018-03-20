var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html

//定义地址
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src'); //__dirname 中的src目录，以此类推
var APP_FILE = path.resolve(APP_PATH, 'App.jsx'); //根目录文件app.jsx地址
var BUILD_PATH = path.resolve(ROOT_PATH, '/build/dist'); //发布文件所存放的目录


module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        app: [
            'webpack-hot-middleware/client',
            APP_FILE
        ]
    },
    output: {
        publicPath: '/build/dist/', //编译好的文件，在服务器的路径,这是静态资源引用路径
        path: BUILD_PATH, //发布文件地址
        filename: '[name].js', //编译后的文件名字
        chunkFilename: '[name].[chunkhash:5].min.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /^node_modules$/,
            loader: 'babel-loader',
            query: {compact: false}
        },
         {
            test: /\.css$/,
            exclude: /^node_modules$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader", "postcss-loader"]
            })
        }, {
            test: /\.less$/,
            exclude: /^node_modules$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ["css-loader", "less-loader", "postcss-loader"]
            })
        }, {
            test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
            exclude: /^node_modules$/,
            loader: 'file-loader?name=[name].[ext]'
        }, {
            test: /\.(png|jpg|gif)$/,
            exclude: /^node_modules$/,
            loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
            //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图
        }, {
            test: /\.jsx$/,
            exclude: /^node_modules$/,
            loaders: ['jsx-loader', 'babel-loader']
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            //process.argv：当前进程的命令行参数数组。
            //process.env：指向当前shell的环境变量，比如process.env.HOME。
            'process.env': {
                NODE_ENV: JSON.stringify('development'), //定义编译环境
                baseFileUrl: JSON.stringify("http://biz.test321.hongcai.com/uploads/"),
                domain: JSON.stringify("http://biz.test321.hongcai.com"),
                WEB_DEFAULT_DOMAIN: JSON.stringify("/enterprise/api/v1"),
                RESTFUL_DOMAIN: JSON.stringify("/enterprise/rest"),
                CGT_ADDRESS: JSON.stringify("http://101.200.54.92/bha-neo-app/lanmaotech/gateway")
            }
        }),
        new ExtractTextPlugin("[name].css"),
        new HtmlWebpackPlugin({  //根据模板插入css/js等生成最终HTML
            filename: '../index.html', //生成的html存放路径，相对于 path
            template: './src/template/index.html', //html模板路径
            hash: false,
            favicon: './favicon.ico'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.scss', '.css'], //后缀名自动补全
    }
};
