import 'reflect-metadata';
import { Application } from 'egg';
import { pandorouter } from './core';

export * from './decorators';

export const router = (app: Application) => {
    return pandorouter.bootstrap(app);
};
