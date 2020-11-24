import { Application } from 'egg';
import { connectDB, loadEntityAndModel, watchEntity } from './core';

export const typeorm = async (app: Application) => {
    const config = app.config.typeorm;
    if (config) {
        app.beforeStart(async () => {
            try {
                await connectDB(app);
                // if (app.config.env === 'local') {
                watchEntity(app);
                // }
                await loadEntityAndModel(app);
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
