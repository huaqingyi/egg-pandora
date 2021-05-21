import { Application, Context, Controller } from 'egg';
import { map, isRegExp } from 'lodash';
import { PANDORACONTROLMIDLE, PANDORAROUTER, PANDORAROUTEREABLE, PANDORAROUTES, PANDORAACTIONMIDLE } from './preconst';
import { existsSync } from 'fs';
import Router from 'koa-router';

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
            let prefixs = control[PANDORAROUTER];
            const fullPath = control.prototype.fullPath.
                split('\\').join('/').
                replace(/[\/]{2,9}/g, '/').
                replace(/(\.ts)|(\.js)/g, '');

            const controlName = fullPath.substring(fullPath.indexOf('controller/') + 'controller/'.length);
            prefixs = prefixs || [`/${fullPath.substring(fullPath.indexOf('controller/') + 'controller/'.length)}`];
            // prefix = prefix.startsWith('/') ? prefix : '/' + prefix;
            const logicPath = control.prototype.fullPath.split('controller/').join('logic/');
            await Promise.all(map(actions, ({ config, name }) => Promise.all(map(config.methods, async method => {
                const ciddles: Router.IMiddleware<any, any>[] = control[PANDORACONTROLMIDLE] || [];
                const aiddles: Router.IMiddleware<any, any>[] = (control[PANDORAACTIONMIDLE] || {})[name] || [];
                const middlewares = ciddles.concat(aiddles);
                return Promise.all(map(prefixs, async prefix => {

                    let path: RegExp | string = ``;
                    if (isRegExp(prefix)) {
                        // /prefix/.source + /config.path/.source
                        if (isRegExp(config.path)) path = new RegExp(`${prefix.source + config.path.source}$`, 'gi');
                        // /prefix/.source + (new RegExp(config.path)).source
                        else path = new RegExp(`${prefix.source + (new RegExp(config.path)).source}$`, 'gi');
                    } else {
                        // (new RegExp('prefix')).source + config.path.source
                        if (isRegExp(config.path)) path = new RegExp(`${(new RegExp(prefix)).source + config.path.source}$`, 'gi');
                        // 'prefix/config.path'
                        else {
                            const paths = `${prefix}/${config.path}`.split('//').join('/').split('');
                            const p = paths.pop() || '';
                            if (p !== '/') { paths.push(p); }
                            path = paths.join('');
                        }
                    }
                    console.log(111, path);
                    if (existsSync(logicPath)) {
                        const LogicClass = (await import(logicPath)).default;
                        const actions: any[] = [];

                        if ((app as any).jwt && config.secret !== false) { actions.push((app as any).jwt); }
                        actions.push(async (ctx: Context, next) => {
                            const logics = (new LogicClass(ctx));
                            if (logics[name]) {
                                const valid = await logics[name].apply(logics, [ctx]);
                                if (valid === false) return valid;
                            }
                            return await next();
                        });
                        actions.push(app.controller[controlName][name]);
                        app.router[method.toLocaleLowerCase()](path, ...middlewares, ...actions);
                    } else {
                        const actions: Function[] = [];
                        if ((app as any).jwt && config.secret !== false) { actions.push((app as any).jwt); }
                        actions.push(app.controller[controlName][name]);
                        app.router[method.toLocaleLowerCase()](path, ...middlewares, ...actions);
                    }
                    return app.router;
                }));
            }))));
            return control;
        }));
    }
}

export const pandorouter = new PandoraRouter();
