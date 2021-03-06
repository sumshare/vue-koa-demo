// "server": "nodemon --delay 2000ms -w app.js -w server server-entry.js"
// 真正入口是server-entry.js

// 请运行npm run server来启动后台 npm run dev 启动前台
import Koa from 'koa';
import json from 'koa-json';
import logger from 'koa-logger';
import auth from './server/routes/auth.js';
import api from './server/routes/api.js';
import jwt from 'koa-jwt';
import path from 'path';
import serve from 'koa-static';
import historyApiFallback from 'koa2-history-api-fallback';
import koa_router from "koa-router";
import koa_bodyparser from "koa-bodyparser";

const app = new Koa();
const router = koa_router();
// 挂载各种中间件
app.use(koa_bodyparser());
app.use(json());
app.use(logger());

app.use(async function(ctx, next) {
    let start = new Date;
    await next();
    let ms = new Date - start;
    console.log('%s %s - %s', ctx.method, ctx.url, ms);
});

//  如果JWT验证失败，返回验证失败信息
app.use(async function(ctx, next) {
    try {
        await next();
    } catch (err) {
        if (401 === err.status) {
            ctx.status = 401;
            ctx.body = {
                success: false,
                token: null,
                info: 'Protected resource, use Authorization header to get access'
            };
        } else {
            throw err;
        }
    }
});

app.on('error', function(err, ctx) {
    console.log('server error', err);
});
// 挂载到koa-router上，同时会让所有的auth的请求路径前面加上'/auth'的请求路径。
router.use('/auth', auth.routes());
// 所有走/api/打头的请求都需要经过jwt验证。
router.use("/api", jwt({
    secret: 'vue-koa-demo'
}), api.routes());

// 将路由规则挂载到Koa上。
app.use(router.routes());
app.use(historyApiFallback());

// 将webpack打包好的项目目录作为Koa静态文件服务的目录
// 在run dev中工程跑在8080端口，
// 这里将生产环境指向dist目录
// http://localhost:8889/todolist
app.use(serve(path.resolve('dist')));

app.listen(8889, () => {
    console.log('Koa is listening in 8889');
});

export default app;