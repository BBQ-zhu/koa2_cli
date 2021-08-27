更新过的文件：
前端：
src\views\Product.vue
src\assets\js\common.js
src\views\Contract.vue
src\request\api.js
src\views\EntrSchool.vue
src\views\Login.vue

后端：
app.js
models\contract.js
routes\contract.js
routes\uploads.js
models\videos.js



教学网址：https://blog.csdn.net/weixin_46182770/article/details/112974311

全局安装koa的脚手架（只需要安装一次）：npm install koa-generator -g

安装脚手架目录koa2 server （server是项目名称）

安装依赖npm install

进入到server文件夹中

启动命令：npm run dev    /    node bin/www

在bin/www文件中prot中修改端口号

注意：用脚手架搭建的koa2项目的启动方式和普通的node app.js启动方式不同


1、在使用ueditor中注意事项

现在后端安装koa2-ueditor
由于后端使用的是koa-multer解析图片，而我使用的是koa-body，所以会造成冲突问题，
解决办法：分开设置，在main，js中引入koaBody但是不配置允许上传文件，而在对应接口中去设置
//上传员工图片(假上传)
router.post('/userImg',KoaBody({multipart: true}),uploads.userImg)

2、在配置ueditor加载本地文件失败的情况
ueditor基本教程：https://blog.csdn.net/weixin_46561402/article/details/105899004
ueditor官方文档：http://fex.baidu.com/ueditor/#server-deploy
ueditor下载：https://github.com/sealice/koa2-ueditor/tree/master/example/public
下载ueditor文件夹后，需要把名称改为UE且把该文件夹放在前端项目public文件目录下，且把该文件中的ueditor.config.js中的
 window.UEDITOR_HOME_URL="/UE/" //静态文件访问的重要配置，默认public下的文件夹，还要修改请求接口，注意和后端一致，
// 服务器统一请求接口路径 ，api只是前缀
 , serverUrl: "/api/editor/controller"

main.js中引入

import '../public/UE/ueditor.config.js'
import '../public/UE/ueditor.all.min.js'
import '../public/UE/lang/zh-cn/zh-cn.js'
import '../public/UE/ueditor.parse.min.js'
挂载接口
// router.all('/editor/controller', ueditor('public'))

图片的请求接口记得做代理至后端接口，不然他会使用脚手架本地搭建的服务端口，后端还要做好跨域处理

