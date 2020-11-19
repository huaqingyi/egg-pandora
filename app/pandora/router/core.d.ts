import { Application, Controller } from 'egg';
export interface PandoraRouterOption {
    autoloader?: boolean;
    enable?: boolean;
}
export declare class PandoraRouter {
    routes: (new (...props: any) => Controller)[];
    constructor();
    bootstrap(app: Application, config: PandoraRouterOption): Promise<Application | (new (...props: any) => Controller)[]>;
}
export declare const pandorouter: PandoraRouter;
