const webpack = require('webpack');

export default (config, env, helpers) => {
    // console.log(config)

    if (env.isProd) {
      config.devtool = false

      config.output.filename = '[name].js',
          config.output.chunkFilename = '[name].js',
          config.plugins.push(
              new webpack.optimize.LimitChunkCountPlugin({
                  maxChunks: 1,
              })
          )
      let { plugin } = helpers.getPluginsByName(config, "MiniCssExtractPlugin")[0];
      plugin.options.filename = "[name].css"

      config.module.rules = config.module.rules.map((item) => {
        if (item.loader === 'file-loader'){
          return {
            test: /\.(svg|woff2?|ttf|eot|jpe?g|png|webp|gif|mp4|mov|ogg|webm)(\?.*)?$/i,//正则表达式匹配图片规则
            use: [{
              loader: 'url-loader',
              options: {
                limit: 8192,//限制打包图片的大小：
                //如果大于或等于8192Byte，则按照相应的文件名和路径打包图片；如果小于8192Byte，则将图片转成base64格式的字符串。
                name: 'images/[name]-[hash:8].[ext]',//images:图片打包的文件夹；
                //[name].[ext]：设定图片按照本来的文件名和扩展名打包，不用进行额外编码
                //[hash:8]：一个项目中如果两个文件夹中的图片重名，打包图片就会被覆盖，加上hash值的前八位作为图片名，可以避免重名。
              }
            }],
          }
        }
        return item
      })
    } else {
      config.devServer.proxy = [
        {
          path: '/api/**',
          target: 'http://172.16.14.199',
          // ...any other stuff...
        }
      ];
    }

  // let { rule2 } = helpers.getLoadersByName(config, 'url-loader')[0];
  // console.log(rule2)


  //   babelConfig.plugins.push(require.resolve('my-chosen-plugin'));
    //   babelConfig.env = { 
    //     // ...some settings... 
    //   }


    // let { index } = helpers.getPluginsByName(config, 'MiniCssExtractPlugin')[0]
    // config.plugins.splice(index, 1)

    // export default (config, env, helpers) => {
    //     let { index } = helpers.getPluginsByName(config, 'some-plugin')[0]
    //     config.plugins.splice(index, 1)
    //   };

    // config.devServer.proxy = [
    //     {
    //       path: '/api/**',
    //       target: 'http://api.example.com',
    //       // ...any other stuff...
    //     }
    //   ];

    //     Absolute Imports
    // It is sometimes annoying to write ../../../components/App.js when you have a nested directory structure. This will help you to import like components/App.js.

    // import { lstatSync, readdirSync, existsSync } from 'fs';

    // const isDirectory = source => lstatSync(source).isDirectory();
    // const getDirectories = source =>
    //     readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);

    // getDirectories('src/').map((dir) => {
    //     config.resolve.alias[dir.replace('src/', '')] = path.resolve(__dirname, dir);
    // });
}