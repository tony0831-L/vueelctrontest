const webpack = require('webpack');
module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            'process.env.FLUENTFFMPEG_COV': false
        },
    }
}