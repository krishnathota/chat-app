import path from 'path';
import {Configuration, DefinePlugin} from 'webpack';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const pluginName = require('./src/plugin/manifest').typeName;

const webpackConfig = (ENV): Configuration => {
    let _config: Configuration = {
        entry: './src/index.tsx',
        ...(process.env.production || !process.env.development
            ? {}
            : {devtool: 'eval-source-map'}),

        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            plugins: [new TsconfigPathsPlugin({configFile: './tsconfig.json'})],
        },
        output: {
            path: path.join(__dirname, `/dist/${pluginName}`),
            filename: 'main.js',
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: 'style.css',
            }),

            // DefinePlugin allows you to create global constants which can be configured at compile time
            new DefinePlugin({
                'process.env':
                    process.env.production || !process.env.development,
            }),
            new ForkTsCheckerWebpackPlugin({
                // Speeds up TypeScript type checking and ESLint linting (by moving each to a separate process)
                eslint: {
                    files: './src/**/*.{ts,tsx,js,jsx}',
                },
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                    exclude: /build/,
                },
                {
                    test: /\.s?css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        // 'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ],
        },
        devServer: {
            port: 3000,
            open: true,
            historyApiFallback: true,
        },
    };
    if (ENV.WEBPACK_SERVE) {
        _config.entry = './src/_local.tsx';
        _config.plugins.push(
            new HtmlWebpackPlugin({
                // HtmlWebpackPlugin simplifies creation of HTML files to serve your webpack bundles
                template: './src/plugin/index.html',
            }),
        );
    } else {
        _config.externals = {
            react: 'React',
            'react-dom': 'ReactDOM',
        };
        _config.plugins.push(
            new CopyPlugin({
                patterns: [{context: 'src/plugin', from: '**/*'}],
            }),
        );
    }
    return _config;
};

export default webpackConfig;
