module.exports = {
    // 修改 src 为 examples
    // pages: {
    //     index: {
    //         entry: __dirname + '/demo/main.js',
    //         template: __dirname + '/public/index.html',
    //         filename: 'index.html'
    //     }
    // },
    // 强制内联CSS
    css: { extract: false },
    // 扩展 webpack 配置，使 packages 加入编译
    chainWebpack: config => {
        config.module
            .rule('js')
            .include
            .add(__dirname + '/src')
            .end()
            .use('babel')
            .loader('babel-loader')
            .options({})
    }
}