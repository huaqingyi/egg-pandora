import { Application } from 'egg';
import { PandoraRouterOption } from './router/core';
import { swagger, SwaggerOption } from './swagger';
import { typeorm } from './typeorm';

export * from './swagger';
export * from './aopImpl';
export * from './router';
export * from './typeorm';

export interface PandoraOption {
    router?: PandoraRouterOption;
    swagger?: SwaggerOption;
    typeorm?: boolean;
}

export const bootstrap = (app: Application, config: PandoraOption) => {
    swagger(app, config.swagger);
    if (config.typeorm !== false) { typeorm(app); }
}
