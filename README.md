# Webpack4 Config File
  It's my Webpack4 config file, I used it for my portfolio. 
## Installation
```
  npm init
  npm i webpack webpack-cli -D
```
  And install other dev dependencies by my package.json file.
## Core Concepts

- Entry
- Output
- Loaders
- Plugins
- Mode

**Entry**  

An entry point is used to begin building out its internal dependency graph.  
```
  module.exports = {
    entry: './src/index.js'
  }
```  
**Output**   

The output is used to tell webpack where to create the bundles.  
```
  const {resolve} = require('path');
  module.exports = {
    entry: ['./src/index.js', './src/index.html'],
    output: {
        filename:'built.js',
        path: resolve(__dirname, './build')
    },
  }
```

**Loaders**  

Webpack only understands JavaScript and JSON files. Loaders allow webpack to process other types of files.
```
module.exports = {
    entry: ['./src/index.js', './src/index.html'],
    output: {
        filename:'built.[contenthash:10].js',
        path: resolve(__dirname, './build')
    },
    module:{
        rules:[
            {
                //css-loader interprets @import and url() like import/require() and will resolve them
                //style-loader can inject CSS into the DOM
                test: /\.css$/,
                use: ['style-loader', 'css-loader'] 
            },
            {
                //sass-loader loads a Sass/SCSS file and compiles it to CSS
                test: /\.scss$/,
                use:['style-loader', 'css-loader', 'sass-loader']
            },
            {
                //url-loader, if the file size is less than limit option, the image fill will be be transformed into base64 URIs
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 10*1024,
                    esModule: false,
                    name: '[hash:10].[ext]',
                    outputPath: 'imgs'
                }
            },
            {
                // html-loader exports HTML as string
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                //The file-loader resolves import/require() on a file into a url, as fonts, svg, video, font icons......
                exclude: /\.(html|js|css|scss|jpg|png|gif)$/,
                loader: 'file-loader'
            }
        ]
    }
}
```
**Plugins**

plugins can be leveraged to perform a wider range of tasks like bundle optimization.
```
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  ...
  plugins: [
    // html-webpack-plugin generates an HTML file for your application by injecting automatically all your generated bundles.
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```
**Mode**  

the mode parameter to either development or production
```
module.exports = {
  ...
  mode: 'production'
};
```
## Issues  
- The CSS files are embedded in javascript file
  ```
    //This plugin extracts CSS into separate files
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');

    module.exports = {
      plugins: [new MiniCssExtractPlugin()],
      module: {
        rules: [
          {
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
          },
        ],
      },
    };
  ```
- Browser compatibility
  ```
  process.env.NODE_ENV = 'production';
  module.exports = {
    module:{
        rules:[
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 
                {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'postcss',
                        plugins: ()=>[require('postcss-preset-env')()]
                    },
                }]
            }
     }
  }
  ```
  modify the package.json file, add the code:
  ```
    "browserslist": {
    "development": [
      "last 1 chrome version",
      "last 1 safari version",
      "last 1 firefox version"
    ],
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ]
  }
  ```
- ECMAScript 6 compatibility
  ```
  ...
  module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          options:{
            presets: [
              [
                '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: {version:3},
                    targets: "> 0.25%, not dead"
                   }
               ]
            ],
         }
       }
     }
   ]
  }
  ```
- If modify the config file, should restart webpack. We can use webpack-dev-server  

```
module.exports = {
  ...
  devServer: {
    contentBase: './build'
    compress: true,
    port: 3000,
    open: true
  }
};
```
  use ``` npx webpack-dev-server ``` to run it.  
- If there is an error, it is difficult to find the position in original source.
```
  ...
  devtool: 'source-map'
```

## Optimization
- Compress html file
```
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify:{
                collapseWhitespace: true,
                removeComments: true
            }
        }),
     ]
```
- Optimize CSS assets
```
  var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
  module.exports = {
    ...
    plugins: [
      new OptimizeCssAssetsPlugin();
    ]
  };
```
- Package node_modules into a separate file
```
 ...
 optimization:{
    splitChunks: {
        chunks: 'all'
    },
    minimizer:[
        new TerserWebpackPlugin({
            cache: true,
            parallel: true,
            sourceMap: true
        })
    ]
},
```
- babel-loader uses the default cache directory
```
  ...
  {
    test : /\.js$/,
    //不能用字符串形式，找不到路径，必须用/node_module/
    exclude: /node_module/,
    loader: 'babel-loader',
    options:{
        presets: [
            [
                '@babel/preset-env',
                {
                    useBuiltIns: 'usage',
                    corejs: {version:3},
                    targets: "> 0.25%, not dead"
                }
            ]
        ],
        cacheDirectory: true
   }
```
- Enable HMR
```
  module.exports = {
    ...
    devServer: {
      contentBase: './build'
      compress: true,
      port: 3000,
      open: true
    }
  };
```
