import { Application } from 'egg';
import { Core } from './core';

export const typeorm = async (app: Application) => {
    let config;
    try {
        config = app.config.typeorm;
    } catch (err) { }
    if (config) {
        app.beforeStart(async () => {
            try {
                const core = new Core(app);
                await core.connectDB();
                app.logger.info('[typeorm]', '数据链接成功');
            } catch (error) {
                app.logger.error('[typeorm]', '数据库链接失败');
                app.logger.error(error);
            }
        });
    }
};

export * from './core';
export * from './orm';
export * from './context';
