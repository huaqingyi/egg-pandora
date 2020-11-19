declare const MIDDLEWARE_METADATA: any, METHOD_METADATA: any, PATH_METADATA: any;
declare const RequestMethod: any;
declare const createMappingDecorator: unique symbol;
declare const createSingleDecorator: unique symbol;
declare const createArrayDecorator: unique symbol;
declare const mappingRequest: unique symbol;
declare class MethodHandler {
    cMap: any;
    constructor(cMap: any);
    getMetada(targetCb: any): {
        middlewares: any;
        reqMethod: any;
        path: any;
    };
    middleware(): (values: any) => (_target: any, _key: any, descriptor: any) => any;
    get(): (path: any) => (target: any, _key: any, descriptor: any) => any;
    post(): (path: any) => (target: any, _key: any, descriptor: any) => any;
    put(): (path: any) => (target: any, _key: any, descriptor: any) => any;
    delete(): (path: any) => (target: any, _key: any, descriptor: any) => any;
    patch(): (path: any) => (target: any, _key: any, descriptor: any) => any;
    options(): (path: any) => (target: any, _key: any, descriptor: any) => any;
    head(): (path: any) => (target: any, _key: any, descriptor: any) => any;
    all(): (path: any) => (target: any, _key: any, descriptor: any) => any;
    [createMappingDecorator](method: any): (path: any) => (target: any, _key: any, descriptor: any) => any;
    [mappingRequest](metadata: any): (target: any, _key: any, descriptor: any) => any;
    [createSingleDecorator](metadata: any): (value: any) => (target: any, _key: any, descriptor: any) => any;
    [createArrayDecorator](metadata: any): (values: any) => (_target: any, _key: any, descriptor: any) => any;
}
