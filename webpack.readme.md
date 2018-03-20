## 概念
[webpack](https://webpack.js.org/) 一款模块加载器兼打包工具，把各种资源（css、js、图片等等）都作为模块来处理和使用



## 配置[webpack](https://webpack.js.org/)前言
首先要安装 Node.js， Node.js 自带了软件包管理器 npm，Webpack 需要 Node.js v0.6 以上支持，建议使用最新版 Node.js。

```
    <!-- 全局安装webpack -->
    $ npm install webpack -g

    <!-- 通常我们会将 Webpack 安装到项目的依赖中，这样就可以使用项目本地版本的 Webpack -->
    <!-- 进入项目目录 -->
    <!-- 确定已经有 package.json，没有就通过 npm init 创建 -->
    <!-- 安装 webpack 依赖 -->
    $ npm install webpack --save-dev

    <!-- github 上表明webpck1版本已被废弃，鼓励升级到 webpck2 -->
    <!-- 查看 webpack 版本信息 -->
    $ npm info webpack

    <!-- 安装指定版本的 webpack -->
    $ npm install webpack@3.1.0 --save-dev
```

>目前我们的项目使用webpack3.10.0版本，以下按照3.1.0版本来介绍


## 添加配置

在根目录新建一个 webpack.config.js 文件用来声明 Webpack 的配置：

### 1.定义需要的插件、地址

```javascript
    <!-- 拿到path和webpack -->
    var path = require('path');
    var webpack = require('webpack');
    var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包插件
    var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html插件

    <!-- 定义地址 -->
    var ROOT_PATH = path.resolve(__dirname); // 项目根目录
    var APP_PATH = path.resolve(ROOT_PATH, 'src'); //__dirname 中的src目录，以此类推
    var APP_FILE = path.resolve(APP_PATH, 'App.jsx'); //根目录文件app.jsx地址
    var BUILD_PATH = path.resolve(ROOT_PATH, '/build/dist'); //打包发布文件所存放的目录
```


### 2.Entry

入口点指示webpack应该使用哪个模块来开始构建其内部依赖关系图

这里的[webpack hot middleware](https://github.com/glenjamin/webpack-hot-middleware)简单说是实现浏览器的无刷新更新（hot reload），详细参见:

a). [手把手深入理解 webpack dev middleware 原理](https://segmentfault.com/a/1190000005614604)

b). [Express结合Webpack的全栈自动刷新](http://acgtofe.com/posts/2016/02/full-live-reload-for-express-with-webpack)

```javascript
    // 添加入口文件，(当前项目入口文件只有一个 App.jsx)
    entry: {
        app: [
            'webpack-hot-middleware/client',
            APP_FILE
        ]
    }
    // 也可以设置多个入口
    entry: {
        app1: [
            'webpack-hot-middleware/client',
            APP_FILE
        ],
        app2 [
            'webpack-hot-middleware/client',
            '.xx/app2'
        ]
    }
```


### 3. output
output属性 告诉webpack在哪里发出它创建的包以及如何命名这些文件，常用配置:

```javascript
{
    publicPath:'/build/dist/'   编译好的文件在服务器的路径,这是静态资源引用路径,
    path: BUILD_PATH   发布文件地址,
    filename: '[name].js'   入口文件及引用的资源编译后的文件名字,
    chunkFilename:'[name].[chunkhash:5].min.js'    除入口文件外的编译后带5位哈希值格式的文件名字
}

```
以上配置，告诉webpack，我们要把他创建的包放在‘/build/dist/’目录下，静态文件引入目录也是‘/build/dist/’，入口文件及引用的资源打包后是‘入口文件名.js’，其他文件打包后是‘文件名.sh0h3.min.js’格式

了解更多output配置，查看 [https://webpack.github.io/docs/configuration.html](output)




### 4. module and loaders

Webpack 本身只能处理 JavaScript 模块，如果要处理其他类型的文件，就需要使用 loader 进行转换
Loader 可以理解为是模块和资源的转换器，它本身是一个函数，接受源文件作为参数，返回转换的结果。这样，我们就可以通过 require 来加载任何类型的模块或文件，比如 CoffeeScript、 JSX、 LESS 或图片
loader 一般以 xxx-loader 的方式命名，xxx 代表了这个 loader 要做的转换功能，比如 json-loader
在引用 loader 的时候可以使用全名 json-loader，或者使用短名 json，但是wepack2+只能使用全名。命名规则和搜索优先级顺序在 webpack 的 resolveLoader.moduleTemplates api 中定义。

```json
    Default: ["*-webpack-loader", "*-web-loader", "*-loader", "*"]
```

每个loader主要有两个功能：

- a）确定哪个或哪些文件应该由某个加载器转换（test属性）

- b）使用哪些loader转换器来转换这些文件（use或loader属性）

```javascript
    module: {
        rules: [{
            test: /\.css$/,   // 正则匹配文件类型
            exclude: /^node_modules$/,   // 搜索文件忽略node_modules目录
            use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "postcss-loader"] // 这些 loader 会以数组逆序运行。这意味着 postcss-loader 会在 css-loader 之前运行。
                })
            include: [APP_PATH] // 搜索文件在src目录下，将要转换的文件目录
        }]
    }
```

#### 值得注意的是：

- a）include & exclude属性 可以理解为白名单和黑名单，如果不设置，就会遍历所有文件，性能会降低

- b）[ExtractTextPlugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) 是一个单独打包css的插件，经过处理的css不会内联在页面上而是单独抽出来

- c）webpack1 和 webpack2+ 关于module配置有些不同，loader=> rules, loader => use, 参数形式 => options{}对象形式，详细参见 [webpack1升级webpack2](https://www.jianshu.com/p/393b1e606edf)



### 5. plugins

（参考：https://webpack.js.org/concepts/）

loader用来转换某些类型文件，但是插件可以实现更多功能
首先，在使用插件前require('')引入，其次，在plugins 数组中添加，并且需要new语法创建一个实例：

![plugins](https://raw.githubusercontent.com/fuqiang1/vue/develop/my-project/static/plugins.jpg)

#### 1). [postcss](https://github.com/postcss/postcss)

[postcss](https://github.com/postcss/postcss)是一个用JS插件转换样式的工具
webpack2+里不能直接在rules里添加,要用插件LoaderOptionsPlugin再加到plugins配置中：

```javascript
new webpack.LoaderOptionsPlugin({
    postcss: {
        plugins: [
            postcssImport({
            glob: true,
            path: './src'
        }),
        sassyMixins(),
        precss(),
        autoprefixer({ browsers: [ 'last 2 versions' ] }),
    ],
        parser: postcssScss
    }
})
```

##### [postcss](https://github.com/postcss/postcss) 常用插件：

##### a. [postcss-import](https://github.com/postcss/postcss-import)：

要解析@import规则的路径

```javascript
    /* 例如：@import "cssrecipes-defaults"; @import "normalize.css"; */
    /* 将会得到： */

    /* ... content of ../node_modules/cssrecipes-defaults/index.css */
    /* ... content of ../node_modules/normalize.css/normalize.css */
```

##### b. [postcss-sassy-mixins](https://github.com/andyjansson/postcss-sassy-mixins):

和sass关键字混合使用,例如:

```css
    /* before */
    @mixin border-radius($radius) {
        -webkit-border-radius: $radius;
        -moz-border-radius: $radius;
        -ms-border-radius: $radius;
        border-radius: $radius;
    }
    .box { @include border-radius(10px); }
    /* after */
    .box {
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        -ms-border-radius: 10px;
        border-radius: 10px;
    }
```

##### c. [precss](https://github.com/jonathantneal/precss)：

可以让你在你的CSS文件中使用类似Sass的标记，例如：

```css
    /* before */

    $blue: #056ef0;
    $column: 200px;
    .menu {
        width: calc(4 * $column);
    }
    .menu_link {
        background: $blue;
        width: $column;
    }

    /* after */

    .menu {
        width: calc(4 * 200px);
    }
    .menu_link {
        background: #056ef0;
        width: 200px;
    }
```

##### d. [autoprefixer](https://github.com/postcss/autoprefixer)：

将供应商前缀添加到CSS:

```css
    /* before */
    :fullscreen a {
        display: flex;
    }
    /* after */
    :-webkit-full-screen a {
        display: -webkit-box;
        display: flex;
    }
    :-moz-full-screen a {
        display: flex;
    }
    :-ms-fullscreen a {
        display: -ms-flexbox;
        display: flex;
    }
    :fullscreen a {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
    }
```

##### e. [postcss-cssnext](http://cssnext.io/)：

允许使用最新的css语法(已包含autoprefixer)，跟postcss中的autoprefixer重复，运行时报以下警告：（ TODO：如何消除这一警告 ）


![warning](https://raw.githubusercontent.com/fuqiang1/vue/develop/my-project/static/warning.jpg)


(了解postcss更多插件，查阅 [https://github.com/postcss/postcss](https://github.com/postcss/postcss))


#### 2). [DefinePlugin](https://doc.webpack-china.org/plugins/define-plugin/) 
允许创建一个在编译时可以配置的全局常量

```javascript
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
    hello: 0
}),
// 以上变量可以通过 process.env.damain 或者 hello 全局获取使用
```

#### 3). [HotModuleReplacementPlugin](https://doc.webpack-china.org/plugins/hot-module-replacement-plugin/)

启用热替换模块(Hot Module Replacement)，也被称为 HMR, 拓展用法参见[https://webpack.js.org/concepts/](https://webpack.js.org/concepts/)

```javascript
new webpack.HotModuleReplacementPlugin({
  // Options...
})
```

| option | value | using|
|-----|-----|----|
| multiStep| (boolean) | 设置为 true 时，插件会分成两步构建文件。首先编译热加载chunks，之后再编译剩余的通常的资源。|
| fullBuildTimeout | (number) | 当 multiStep 启用时，表示两步构建之间的延时。|
| requestTimeout | (number) | 下载 manifest 的延时（webpack 3.0.0 后的版本支持）|

### 6. [resolve](https://webpack.github.io/docs/configuration.html)
是一个影响模块解析的选项，
reslove有很多其他属性，这里只说项目中使用的extensions，
它是用来解析模块的扩展数组，比如，想把'require(/styles/common)'解析为 common.less, 就应该在extensions:[]数组中添加‘.less’，简单说就是会自动补全文件名

```javascript
 // js, jsx, less, scss, css后缀名自动补全
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.scss', '.css'], 
    }
```

resolve的更多属性，阅读[https://webpack.github.io/docs/configuration.html](https://webpack.github.io/docs/configuration.html)
