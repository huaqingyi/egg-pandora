import { Application, Controller } from 'egg';
export declare class PandoraRouter {
    routes: (new (...props: any) => Controller)[];
    constructor();
    bootstrap(app: Application): Promise<(new (...props: any) => Controller)[]>;
}
export declare const pandorouter: PandoraRouter;
