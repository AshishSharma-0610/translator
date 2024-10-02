const path = require('path');

module.exports = {
    entry: './extension/src/popup.js',
    output: {
        filename: 'popup.js',
        path: path.resolve(__dirname, 'extension'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react', '@babel/preset-env'],
                    },
                },
            },
        ],
    },
};