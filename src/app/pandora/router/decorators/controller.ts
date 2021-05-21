import { Controller } from 'egg';
import { isRegExp, isString, isArray } from 'lodash';
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
    secret?: boolean;
}

export type RestControllerOption = string | RegExp;

export function RestController<T extends (new (...props: any) => Controller)>(target: T): T;
export function RestController(path: RestControllerOption | RestControllerOption[]): <T extends (new (...props: any) => Controller) >(target: T) => T;
export function RestController(props: any) {
    const isPath = isString(props) || isRegExp(props);
    const isArrPath = isArray(props) && (isString(props[0]) || isRegExp(props[0]));
    if (isPath || isArrPath) {
        return <T extends (new (...props: any) => Controller)>(target: T) => {
            
            const router: RestControllerOption[] = [];
            if (isPath) router.push(props);
            else router.push(...props);

            target[PANDORAROUTER] = router;
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
