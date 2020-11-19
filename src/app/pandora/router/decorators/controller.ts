import { Controller } from 'egg';
import { isString } from 'lodash';
import { pandorouter } from '../core';
import { PANDORAROUTER, PANDORAROUTEREABLE, PANDORAROUTES } from '../preconst';

export enum RequestMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    OPTIONS = 'OPTIONS',
    HEAD = 'HEAD',
    ALL = 'ALL',
}

export interface RequestMappingOption {
    path?: string;
    methods?: (RequestMethod | string)[];
}

export function RestController<T extends (new (...props: any) => Controller)>(target: T): T;
export function RestController(path: string): <T extends (new (...props: any) => Controller) >(target: T) => T;
export function RestController(props: any) {
    if (isString(props)) {
        return <T extends (new (...props: any) => Controller)>(target: T) => {
            target[PANDORAROUTER] = props;
            target[PANDORAROUTEREABLE] = true;
            pandorouter.routes.push(target);
            return target;
        }
    } else {
        props[PANDORAROUTEREABLE] = true;
        pandorouter.routes.push(props);
        return props;
    }
};

export function parserm(
    config: RequestMappingOption,
    target: Controller, key: string, descr: TypedPropertyDescriptor<Controller>,
) {
    if (!config.path) { config.path = key; }
    if (!config.methods) { config.methods = [RequestMethod.ALL]; }
    if (!target.constructor[PANDORAROUTES]) { target.constructor[PANDORAROUTES] = []; }
    target.constructor[PANDORAROUTES].push({ config, action: descr.value, name: key });
}

export function RequestMapping(
    target: Controller, key: string,
): void;
export function RequestMapping(options: RequestMappingOption): (
    target: Controller, key: string,
) => void;
export function RequestMapping(...props: any[]) {
    if (props[1]) {
        const [target, key, descr] = props;
        parserm({}, target, key, descr);
    } else {
        return (target: Controller, key: string, descr: TypedPropertyDescriptor<Controller>) => {
            const [config] = props;
            parserm(config, target, key, descr);
        }
    }
}
