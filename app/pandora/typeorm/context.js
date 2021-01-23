"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeORM = void 0;
const typeorm_1 = require("typeorm");
exports.TypeORM = {
    repo(Entity, dbName) {
        const repository = typeorm_1.getConnection(dbName).getRepository(Entity);
        return new Proxy(repository, {
            get(target, key) {
                if (target[key]) {
                    return target[key];
                }
                return Entity.prototype[key].bind(target);
            },
            set(target, key, value) {
                target[key] = value;
                return true;
            }
        });
    },
};

//# sourceMappingURL=../../../sourcemaps/app/pandora/typeorm/context.js.map
