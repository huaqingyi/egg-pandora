import { Controller } from 'egg';
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
    secret?: boolean;
}
export declare type RestControllerOption = string | RegExp;
export declare function RestController<T extends (new (...props: any) => Controller)>(target: T): T;
export declare function RestController(path: RestControllerOption | RestControllerOption[]): <T extends (new (...props: any) => Controller)>(target: T) => T;
export declare function parserm(config: RequestMappingOption, target: Controller, key: string, descr: TypedPropertyDescriptor<Controller>): void;
export declare function RequestMapping(target: Controller, key: string): void;
export declare function RequestMapping(options: RequestMappingOption): (target: Controller, key: string) => void;
