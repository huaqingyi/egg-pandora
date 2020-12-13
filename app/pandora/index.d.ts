import { Application } from 'egg';
import { PandoraRouterOption } from './router/core';
import { SwaggerOption } from './swagger';
export * from './swagger';
export * from './aopImpl';
export * from './router';
export * from './typeorm';
export interface PandoraOption {
    router?: PandoraRouterOption;
    swagger?: SwaggerOption;
    typeorm?: boolean;
}
export declare const bootstrap: (app: Application, config: PandoraOption) => void;
