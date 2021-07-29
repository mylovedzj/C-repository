//生产环境---静态常量
const PRODUCTION = 'production';
import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport from 'vite-plugin-style-import';
const path = require("path");
const root = process.cwd();
//适配低版本浏览器
import legacy from '@vitejs/plugin-legacy';
//gzip压缩
//const CompressionWebpackPlugin = require('compression-webpack-plugin');
export default ({command, mode}) => {
    //viteEnv   env常量
    const viteEnv = loadEnv(mode, root);

    return defineConfig({
        plugins: [
            vue(),
                styleImport({
                libs: [{
                    libraryName: 'element-plus',
                    esModule: true,
                    ensureStyleFile: true,
                    resolveStyle: (name) => {
                    name = name.slice(3)
                    return `element-plus/packages/theme-chalk/src/${name}.scss`;
                    },
                    resolveComponent: (name) => {
                    return `element-plus/lib/${name}`;
                    },
                  }]
                })
            //低版本浏览器
            /*legacy({
                targets: ['defaults', 'not IE 11']
            }),*/
            //gzip
            /*new CompressionWebpackPlugin({
                algorithm: 'gzip',
                //匹配的文件名
                test: /\.js$|\.html$|\.css/,
                //对超过1K的压缩
                threshold: 1024,
                //是否删除原文件
                deleteOriginalAssets: false
            })*/
        ],
        resolve: {
            //别名配置
            alias: {
                '@': path.resolve(__dirname, './src')
            },
        },
        /**
         * https://cn.vitejs.dev/config/#base
         * 绝对 URL 路径名，例如 /foo/
         * 完整的 URL，例如 https://foo.com/
         * 空字符串或 ./（用于开发环境）
         */
        base: PRODUCTION === mode ? '/weekPlan/' : './',
        server: {
            port: 80,
            host: "192.9.214.35",
            https: false,
        },
        css: {
            // css预设器配置项
            loaderOptions: {
                less: {
                    lessOptions: {
                        //可以覆盖样式
                        modifyVars: {},
                        javascriptEnabled: true,
                    }
                },
                
            },
        },
        build: {
            //浏览器兼容性
            target: 'es2015',
            //输出目录
            outDir: `dist/${mode || 'temp'}`,
            //指定生成静态资源的存放路径
            assetsDir: 'assets',
            //启用/禁用 CSS 代码拆分。当启用时，在异步 chunk 中导入的 CSS 将内联到异步 chunk 本身，并在块加载时插入。
            // 如果禁用，整个项目中的所有 CSS 将被提取到一个 CSS 文件中。
            cssCodeSplit: true,
            //在构建生产包时生成 sourceMap 文件
            sourcemap: PRODUCTION !== mode,
            //启用/禁用 brotli 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
            brotliSize: false,
        },
         
    });
}