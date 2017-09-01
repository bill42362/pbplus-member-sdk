// webpack.config.babel.js

const isProd = process.env.NODE_ENV === 'production';

export default {
    entry: [
        './src/index.js',
    ],
    output: {
        filename: 'index.js',
        path: `${__dirname}/dist/`,
        publicPath: isProd ? `/` : `http://localhost:${WDS_PORT}/`,
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            { test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/ },
        ]
    },
    devtool: isProd ? false : 'source-map',
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
          react: `${__dirname}/node_modules/react`,
        },
    },
    externals: {
        react: 'commonjs react'
    }
};
