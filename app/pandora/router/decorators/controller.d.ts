import { Context, Controller } from 'egg';
export declare enum RequestMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD",
    ALL = "ALL"
}
export interface RequestMappingOption {
    path?: string;
    methods?: (RequestMethod | string)[];
}
export declare function RestController<T extends (new (...props: any) => Controller)>(target: T): T;
export declare function RestController(path: string): <T extends (new (...props: any) => Controller)>(target: T) => T;
export declare function parserm(config: RequestMappingOption, target: Controller, key: string, descr: TypedPropertyDescriptor<Controller>): void;
export declare function RequestMapping(target: Controller, key: string): void;
export declare function RequestMapping(options: RequestMappingOption): (target: Controller, key: string) => void;
export declare class Logic extends Controller {
    constructor(ctx: Context);
}
