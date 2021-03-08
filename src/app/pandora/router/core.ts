import { Application, Context, Controller } from 'egg';
import { map } from 'lodash';
import { PANDORAROUTER, PANDORAROUTEREABLE, PANDORAROUTES } from './preconst';
import { existsSync } from 'fs';

export interface PandoraRouterOption {
    autoloader?: boolean;
    enable?: boolean;
}

export class PandoraRouter {
    public routes: (new (...props: any) => Controller)[];

    constructor() {
        this.routes = [];
    }

    public async bootstrap(app: Application, config: PandoraRouterOption) {
        config = {
            autoloader: true,
            ...config,
        }
        if (config.enable === false) { return app; }
        return await Promise.all(map(this.routes, async control => {
            const ismap = control[PANDORAROUTEREABLE];
            if (ismap !== true && config.autoloader === false) { return control; };
            const actions = control[PANDORAROUTES];
            let prefix = control[PANDORAROUTER];
            const fullPath = control.prototype.fullPath.
                split('\\').join('/').
                replace(/[\/]{2,9}/g, '/').
                replace(/(\.ts)|(\.js)/g, '');

            const controlName = fullPath.substring(fullPath.indexOf('controller/') + 'controller/'.length);
            prefix = prefix || fullPath.substring(fullPath.indexOf('controller/') + 'controller/'.length);
            prefix = prefix.startsWith('/') ? prefix : '/' + prefix;
            const logicPath = control.prototype.fullPath.split('controller/').join('logic/');

            await Promise.all(map(actions, ({ config, name }) => Promise.all(map(config.methods, async method => {
                const path = `${prefix}${config.path.startsWith('/') ? config.path : `/${config.path}`}`;

                if (existsSync(logicPath)) {
                    const actions = [async (ctx: Context, next) => {
                        const LogicClass = (await import(logicPath)).default;
                        const logics = (new LogicClass(ctx));
                        try {
                            if (logics[name]) {
                                const valid = await logics[name].apply(logics, [ctx]);
                                if (valid === false) return valid;
                            }
                        } catch (error) {
                            await next();
                            return ctx.throw(500, error.message);
                        }
                        return await next();
                    }];
                    if ((app as any).jwt && config.secret !== false) { actions.push((app as any).jwt); }
                    actions.push(app.controller[controlName][name]);
                    app.router[method.toLocaleLowerCase()](path, ...actions);
                } else {
                    const actions: Function[] = [];
                    if ((app as any).jwt && config.secret !== false) { actions.push((app as any).jwt); }
                    actions.push(app.controller[controlName][name]);
                    app.router[method.toLocaleLowerCase()](path, ...actions);
                }
                return app.router;
            }))));
            return control;
        }));
    }
}

export const pandorouter = new PandoraRouter();
