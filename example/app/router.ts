import { Application } from 'egg';
import { router } from 'egg-pandora';

export default (app: Application) => {
    // // 挂载鉴权路由
    // app.passport.mount('github');
    // app.passport.mount('weixin');
    router(app);
};
