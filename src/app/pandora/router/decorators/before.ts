import { Controller } from 'egg';
import Router from 'koa-router';
import { PANDORACONTROLMIDLE, PANDORAACTIONMIDLE } from '../preconst';

export function Before<StateT = any, CustomT = {}>(...middleware: Array<Router.IMiddleware<StateT, CustomT>>) {
    return <T extends (new (...props: any) => Controller)>(target: T) => {
        target[PANDORACONTROLMIDLE] = middleware;
    }
}

export function ABefore<StateT = any, CustomT = {}>(...middleware: Array<Router.IMiddleware<StateT, CustomT>>) {
    return (target: Controller, prototypeKey: string) => {
        const actionsall = target.constructor[PANDORAACTIONMIDLE] || {};
        const actions: Router.IMiddleware<any, any>[] = actionsall[prototypeKey] || [];
        actions.push(...middleware);
        actionsall[prototypeKey] = actions;
        target.constructor[PANDORAACTIONMIDLE] = actionsall;
    }
}