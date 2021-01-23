"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Core = void 0;
const typeorm_1 = require("typeorm");
const typedi_1 = require("typedi");
const lodash_1 = require("lodash");
class Core {
    constructor(app) {
        this.app = app;
        this.config = app.config.typeorm;
        this.env = app.config.env;
    }
    get hasTsLoader() {
        return typeof require.extensions['.ts'] === 'function';
    }
    handleConfig(config) {
        if (this.hasTsLoader) {
            return config;
        }
        const keys = ['entities', 'migrations', 'subscribers'];
        lodash_1.map(keys, (key) => {
            config[key] = config[key].map(item => item.replace(/\.ts$/, '.js'));
        });
        return config;
    }
    async connectDB() {
        typeorm_1.useContainer(typedi_1.Container);
        if (lodash_1.isArray(this.config) && this.config) {
            this.config = lodash_1.map(this.config, conf => this.handleConfig(conf));
            this.app.context.connection = typeorm_1.createConnections(this.config);
        }
        else {
            this.config = this.handleConfig(this.config);
            this.app.context.connection = typeorm_1.createConnection(this.config);
        }
        return this.app.context.connection;
    }
}
exports.Core = Core;

//# sourceMappingURL=../../../sourcemaps/app/pandora/typeorm/core.js.map
