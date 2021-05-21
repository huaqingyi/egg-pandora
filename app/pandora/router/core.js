"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pandorouter = exports.PandoraRouter = void 0;
const lodash_1 = require("lodash");
const preconst_1 = require("./preconst");
const fs_1 = require("fs");
class PandoraRouter {
    constructor() {
        this.routes = [];
    }
    async bootstrap(app, config) {
        config = {
            autoloader: true,
            ...config,
        };
        if (config.enable === false) {
            return app;
        }
        return await Promise.all(lodash_1.map(this.routes, async (control) => {
            const ismap = control[preconst_1.PANDORAROUTEREABLE];
            if (ismap !== true && config.autoloader === false) {
                return control;
            }
            ;
            const actions = control[preconst_1.PANDORAROUTES];
            let prefixs = control[preconst_1.PANDORAROUTER];
            const fullPath = control.prototype.fullPath.
                split('\\').join('/').
                replace(/[\/]{2,9}/g, '/').
                replace(/(\.ts)|(\.js)/g, '');
            const controlName = fullPath.substring(fullPath.indexOf('controller/') + 'controller/'.length);
            prefixs = prefixs || [`/${fullPath.substring(fullPath.indexOf('controller/') + 'controller/'.length)}`];
            // prefix = prefix.startsWith('/') ? prefix : '/' + prefix;
            const logicPath = control.prototype.fullPath.split('controller/').join('logic/');
            await Promise.all(lodash_1.map(actions, ({ config, name }) => Promise.all(lodash_1.map(config.methods, async (method) => {
                const ciddles = control[preconst_1.PANDORACONTROLMIDLE] || [];
                const aiddles = (control[preconst_1.PANDORAACTIONMIDLE] || {})[name] || [];
                const middlewares = ciddles.concat(aiddles);
                return Promise.all(lodash_1.map(prefixs, async (prefix) => {
                    let path = ``;
                    if (lodash_1.isRegExp(prefix)) {
                        // /prefix/.source + /config.path/.source
                        if (lodash_1.isRegExp(config.path))
                            path = new RegExp(`${prefix.source + config.path.source}$`, 'gi');
                        // /prefix/.source + (new RegExp(config.path)).source
                        else
                            path = new RegExp(`${prefix.source + (new RegExp(config.path)).source}$`, 'gi');
                    }
                    else {
                        // (new RegExp('prefix')).source + config.path.source
                        if (lodash_1.isRegExp(config.path))
                            path = new RegExp(`${(new RegExp(prefix)).source + config.path.source}$`, 'gi');
                        // 'prefix/config.path'
                        else {
                            const paths = `${prefix}/${config.path}`.split('//').join('/').split('');
                            const p = paths.pop() || '';
                            if (p !== '/') {
                                paths.push(p);
                            }
                            path = paths.join('');
                        }
                    }
                    console.info(`${method.toLocaleLowerCase()} ${path}`);
                    if (fs_1.existsSync(logicPath)) {
                        const LogicClass = (await Promise.resolve().then(() => __importStar(require(logicPath)))).default;
                        let actions = [];
                        if (app.jwt && config.secret !== false) {
                            actions.push(app.jwt);
                        }
                        actions.push(async (ctx, next) => {
                            const logics = (new LogicClass(ctx));
                            if (logics[name]) {
                                const valid = await logics[name].apply(logics, [ctx]);
                                if (valid === false)
                                    return valid;
                            }
                            return await next();
                        });
                        actions = actions.concat(middlewares);
                        actions.push(app.controller[controlName][name]);
                        app.router[method.toLocaleLowerCase()](path, ...actions);
                    }
                    else {
                        let actions = [];
                        if (app.jwt && config.secret !== false) {
                            actions.push(app.jwt);
                        }
                        actions = actions.concat(middlewares);
                        actions.push(app.controller[controlName][name]);
                        app.router[method.toLocaleLowerCase()](path, ...actions);
                    }
                    return app.router;
                }));
            }))));
            return control;
        }));
    }
}
exports.PandoraRouter = PandoraRouter;
exports.pandorouter = new PandoraRouter();

//# sourceMappingURL=../../../sourcemaps/app/pandora/router/core.js.map
