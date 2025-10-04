const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  
  // Development server configuration
  devServer: {
    port: 8080,
    host: 'localhost',
    hot: true,
    open: true
  },
  
  // Build configuration
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, 'src')
      }
    }
  },
  
  // PWA configuration
  pwa: {
    name: 'COMPHILITY',
    themeColor: '#5B7EFF',
    msTileColor: '#5B7EFF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default'
  },
  
  // CSS configuration
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/styles/variables.scss";`
      }
    }
  }
})
