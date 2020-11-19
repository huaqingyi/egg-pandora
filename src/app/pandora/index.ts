import { Application } from 'egg';
import { aop } from './aopImpl';
// import { router } from './router';
import { swagger } from './swagger';

export * from './swagger';
export * from './aopImpl';
export * from './router';

export const bootstrap = (app: Application) => {
    aop(app);
    swagger(app);
    // router(app);
}
