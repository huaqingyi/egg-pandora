import { Application } from 'egg';
import { aop } from './aopImpl';
import { PandoraRouterOption } from './router/core';
// import { router } from './router';
import { swagger, SwaggerOption } from './swagger';

export * from './swagger';
export * from './aopImpl';
export * from './router';

export interface PandoraOption {
    router?: PandoraRouterOption;
    swagger?: SwaggerOption;
}

export const bootstrap = (app: Application, config: PandoraOption) => {
    aop(app);
    swagger(app, config.swagger);
    // router(app);
}
