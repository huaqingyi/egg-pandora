"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeORM = void 0;
const typeorm_1 = require("typeorm");
const orm_1 = require("./orm");
const lodash_1 = require("lodash");
exports.TypeORM = {
    repo(...props) {
        const [Entity, dbName] = props;
        if (!dbName || lodash_1.isString(dbName)) {
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
        }
        return orm_1.join(...props);
    },
};

//# sourceMappingURL=../../../sourcemaps/app/pandora/typeorm/context.js.map
