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
        react: {
            'commonjs': 'react',
            'commonjs2': 'react',
            'amd': 'react',
            'root': 'React',
        },
        'pbplus-member-ui': {
            'commonjs': 'pbplus-member-ui',
            'commonjs2': 'pbplus-member-ui',
            'amd': 'pbplus-member-ui',
            'root': 'pbplus-member-ui',
        },
        'react-telephone-input/lib/withStyles': {
            'commonjs': 'react-telephone-input/lib/withStyles',
            'commonjs2': 'react-telephone-input/lib/withStyles',
            'amd': 'react-telephone-input/lib/withStyles',
            'root': 'react-telephone-input/lib/withStyles',
        },
    }
};
