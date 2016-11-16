var webpack = require('webpack')
var aliasConfig = require('./alias.config')

module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: './dist',
        publicPath: '/dist/',
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.html$/,
            exclude: /node_modules/,
            loader: 'html'
        }, {
            test: /\.(png|jpg)$/,
            loader: 'file'
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url?limit=10000'
        }, {
            test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/font-woff'
        }, {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/octet-stream'
        }, {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file'
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=image/svg+xml'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.scss$/,
            loader: 'style-loader!css-loader!sass-loader'
        }, {
            test: require.resolve('jquery'),
            loader: 'expose?jQuery!expose?$'
        }, {
            test: require.resolve('d3'),
            loader: 'expose?d3'
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            d3: 'd3'
        })
    ],
    resolve: {
        alias: aliasConfig
    },
    // devtool: '#source-map',
    devServer: {
        proxy: {
            '/statistics/*': {
                target: 'http://192.168.9.190:8002',
                rewrite: function(req) {
                    req.url = req.url.replace(/^\/statistics\/[\d\.]*\//, '/')
                }
            },
            '/static/fonts/*': {
                target: 'http://127.0.0.1:8080',
                rewrite: function(req) {
                    console.log(req.url)
                    req.url = req.url.replace(/^\/static\//, '/src/')
                }
            }
        }
    }
}
