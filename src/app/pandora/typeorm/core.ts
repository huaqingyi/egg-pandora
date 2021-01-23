import { Application } from 'egg';
import { ConnectionOptions, createConnection, createConnections, useContainer } from 'typeorm';
import { Container } from 'typedi';
import { isArray, map } from 'lodash';

export class Core {
    protected config: ConnectionOptions | ConnectionOptions[];
    protected env: any;
    protected get hasTsLoader() {
        return typeof require.extensions['.ts'] === 'function';
    }

    constructor(
        protected app: Application,
    ) {
        this.config = app.config.typeorm;
        this.env = app.config.env;
    }

    public handleConfig(config: ConnectionOptions) {
        if (this.hasTsLoader) { return config; }
        const keys = ['entities', 'migrations', 'subscribers'];
        map(keys, (key) => {
            config[key] = config[key].map(item => item.replace(/\.ts$/, '.js'));
        });
        return config;
    }

    public async connectDB() {
        useContainer(Container);

        if (isArray(this.config) && this.config) {
            this.config = map(this.config, conf => this.handleConfig(conf));
            this.app.context.connection = createConnections(this.config);
        } else {
            this.config = this.handleConfig(this.config);
            this.app.context.connection = createConnection(this.config);
        }
        return this.app.context.connection;
    }
}
