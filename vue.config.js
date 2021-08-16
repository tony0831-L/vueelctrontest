const webpack = require('webpack');
module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions:{
                productName:'老八下載器',
                win: {
                    icon: 'public/icon.png', // 安裝檔圖示
                },
            }
        },
    }
}