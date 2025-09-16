const path = require('path');
const webpack = require('webpack');

// Read package.json version dynamically
const packageJson = require('./package.json');

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const buildMode = process.env.STRDYN_BUILD_MODE || (isProduction ? 'live' : 'dev');

console.log(`🔧 Webpack Build Configuration:
  NODE_ENV: ${process.env.NODE_ENV || 'undefined'}
  STRDYN_BUILD_MODE: ${buildMode}
  Production: ${isProduction}
  Package Version: ${packageJson.version}`);

module.exports = {
    mode: isProduction ? 'production' : 'development',

    entry: './src/main.ts',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'core.js',
        library: {
            name: 'StardynAngularConsole',
            type: 'umd'
        },
        globalObject: 'this',
        clean: {
            keep: /\.d\.ts$/,  // Keep .d.ts files
        }
    },

    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.app.json',
                        transpileOnly: true
                    }
                },
                exclude: /node_modules/
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(packageJson.version),
            __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
            BUILD_ENV: JSON.stringify(buildMode === 'live' ? 'live' : 'dev'),
            __STRDYN_BUILD_MODE__: JSON.stringify(buildMode),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),

        new webpack.BannerPlugin({
            banner: `@stardyn/angular-console v${packageJson.version}
Built: ${new Date().toISOString()}
Environment: ${buildMode}
© Stardyn Team - MIT License`,
            entryOnly: true
        })
    ],

    externals: {
        '@angular/core': {
            commonjs: '@angular/core',
            commonjs2: '@angular/core',
            amd: '@angular/core',
            root: 'ng.core'
        },
        '@angular/common': {
            commonjs: '@angular/common',
            commonjs2: '@angular/common',
            amd: '@angular/common',
            root: 'ng.common'
        }
    },

    optimization: {
        minimize: isProduction,
        usedExports: true,
        sideEffects: false,

        // Production-only optimizations
        ...(isProduction && {
            splitChunks: false, // Keep everything in one bundle
            concatenateModules: true,
            providedExports: true,
            mangleExports: 'size',
            // Add aggressive minification
            minimizer: [
                new (require('terser-webpack-plugin'))({
                    terserOptions: {
                        compress: {
                            drop_console: false, // Keep console for logger system
                            drop_debugger: true,
                            pure_funcs: [],
                            unused: true,
                            dead_code: true
                        },
                        mangle: {
                            safari10: true
                        },
                        output: {
                            comments: false
                        }
                    },
                    extractComments: false
                })
            ]
        })
    },

    devtool: isProduction ? false : 'source-map',

    performance: {
        hints: isProduction ? 'warning' : false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },

    stats: {
        colors: true,
        modules: false,
        chunks: false,
        chunkModules: false,
        entrypoints: false
    }
};