import { Application } from 'egg';
import { ConnectionOptions } from 'typeorm';
export declare class Core {
    protected app: Application;
    protected config: ConnectionOptions | ConnectionOptions[];
    protected env: any;
    protected get hasTsLoader(): boolean;
    constructor(app: Application);
    handleConfig(config: ConnectionOptions): ConnectionOptions;
    connectDB(): Promise<any>;
}
