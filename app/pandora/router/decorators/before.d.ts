import { Controller } from 'egg';
import Router from 'koa-router';
export declare function Before<StateT = any, CustomT = {}>(...middleware: Array<Router.IMiddleware<StateT, CustomT>>): <T extends new (...props: any) => Controller>(target: T) => void;
export declare function ABefore<StateT = any, CustomT = {}>(...middleware: Array<Router.IMiddleware<StateT, CustomT>>): (target: Controller, prototypeKey: string) => void;
