const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
    webpack: (config) => {
        config.plugins.push(
            new Dotenv({
                safe: true
            })
        );
        
        config.module.rules.unshift({
            test: /\.(js|jsx)$/,
            enforce: 'pre',
            use: [
                {
                    loader: require.resolve('eslint-loader'),
                }
            ],
            include: path.resolve('./'),
        });
        
        return config;
    }
}