

var path = require('path'); //node 原生path模块
var webpack = require('webpack'); // webpack
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html文件,并自动将依赖写入html文件中。
var OpenBrowserPlugin = require('open-browser-webpack-plugin'); //webpack插件,webpack 启动后自动打开浏览器插件
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {
    entry: { index: './src/index/index.js',login:'./src/login/login.js',},
    output: {
        path: path.resolve(__dirname,"./build"), //文件输出目录，用于配置文件发布路径，如CDN或本地服务器
        filename: "js/[name].js", //根据入口文件输出的对应多个文件名
        chunkFilename: 'js/[name].chunk.js',
        publicPath: ""
    //     vendor: [
    // +       'lodash'
    // +   ]
    },
    resolve: {
        //配置项,设置忽略js后缀
        extensions: ['', '.js', '.less', '.css', '.png', '.jpg'],
        root: './src',
        // 模块别名
        alias: {
        }
    },
    module: {
        loaders: [{
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: 'url?limit=10000&name=images/[name].[ext]'
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('style', 'css!sass')
             // loaders: ['style', 'css', 'sass']
        }, {
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015']
            }
        }, {
            test: /\.html$/,
            loader: 'html'
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "lalalla", //如果页面内没有设置title标签的时候可生效
            filename: 'index.html', //filename配置的html文件目录是相对于webpackConfig.output.path路径而言的;指定生成的html文件内容中的link和script路径是相对于生成目录下的，写路径的时候请写生成目录下的相对路径
            inject:'head',
            template: './src/index/index.html',
            chunks: ['index']
            // chunks：允许插入到模板中的一些chunk，不配置此项默认会将entry中所有的thunk注入到模板中。在配置多个页面时，每个页面注入的thunk应该是不相同的，需要通过该配置为不同页面注入不同的thunk；
        }),
        new HtmlWebpackPlugin({
            filename: 'login.html', //filename配置的html文件目录是相对于webpackConfig.output.path路径而言的;指定生成的html文件内容中的link和script路径是相对于生成目录下的，写路径的时候请写生成目录下的相对路径
            template: './src/login/login.html',
            chunks: ['login'],
            inject:'head'
            // chunks：允许插入到模板中的一些chunk，不配置此项默认会将entry中所有的thunk注入到模板中。在配置多个页面时，每个页面注入的thunk应该是不相同的，需要通过该配置为不同页面注入不同的thunk；
        }),
         // 启动热替换，模块热替换(HMR - Hot Module Replacement)功能会在应用程序运行过程中替换、添加或删除模块，而无需重新加载整个页面。主要是通过以下几种方式，来显著加快开发速度：
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('[name].css', {
            allChunks: true
        }),
        new OpenBrowserPlugin({
            url: 'http://localhost:8080'
        }),
//         new webpack.optimize.CommonsChunkPlugin({
// +            name: 'vendor'
// +       }), //注意，引入顺序在这里很重要。CommonsChunkPlugin 的 'vendor' 实例，必须在 'manifest' 实例之前引入。将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中，是比较推荐的做法，这是因为，它们很少像本地的源代码那样频繁修改。因此通过实现以上步骤，利用客户端的长效缓存机制，可以通过命中缓存来消除请求，并减少向服务器获取资源，同时还能保证客户端代码和服务器端代码版本一致。这可以通过使用新的 entry(入口) 起点，以及再额外配置一个 CommonsChunkPlugin 实例的组合方式来实现：

        /* 公共库 *CommonsChunkPlugin 插件，是一个可选的用于建立一个独立文件(又称作 chunk)的功能，这个文件包括多个入口 chunk 的公共模块。通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存到缓存中供后续使用。这个带来速度上的提升，因为浏览器会迅速将公共的代码从缓存中取出来，而不是每次访问一个新页面时，再去加载一个更大的文件。 */
        // 提供公共代码
        // 默认会把所有入口节点的公共代码提取出来,生成一个common.js
        // 只提取main节点和index节点
        // new webpack.optimize.CommonsChunkPlugin('common.js',['index','login']),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name:'common', // 注意不要.js后缀
        //     chunks:['main','user','index']
        // }),
        new CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity
            // 传入 `Infinity` 会马上生成 公共chunk，但里面没有模块。
            // 你可以传入一个 `function` ，以添加定制的逻辑（默认是 chunk 的数量）
        })

    ]
};
