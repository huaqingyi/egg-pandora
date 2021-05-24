"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.join = exports.JoinType = exports.uniqueId = exports.TypeOrm = void 0;
const typeorm_1 = require("typeorm");
const lodash_1 = require("lodash");
class TypeOrm extends typeorm_1.Repository {
}
exports.TypeOrm = TypeOrm;
function uniqueId(length = 6) {
    const data = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd',
        'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
        'y', 'z'
    ];
    let nums = '';
    for (let i = 0; i < length; i++) {
        const r = parseInt(String(Math.random() * 51));
        nums += data[r];
    }
    return nums;
}
exports.uniqueId = uniqueId;
var JoinType;
(function (JoinType) {
    JoinType["LEFT"] = "leftJoinAndSelect";
    JoinType["RIGHT"] = "rightJoinAndSelect";
    JoinType["INNER"] = "innerJoinAndSelect";
})(JoinType = exports.JoinType || (exports.JoinType = {}));
function join(left, right, config, callback) {
    const lger = typeorm_1.getManager().getRepository(left);
    const rger = typeorm_1.getManager().getRepository(right);
    const ltn = uniqueId(6);
    const rtn = uniqueId(6);
    if (config.type)
        config.type = JoinType.LEFT;
    const lcol = {};
    const rcol = {};
    lodash_1.map(lger.metadata.columns, ({ databaseName, propertyName }) => lcol[propertyName] = `${ltn}.${databaseName}`);
    lodash_1.map(rger.metadata.columns, ({ databaseName, propertyName }) => rcol[propertyName] = `${rtn}.${databaseName}`);
    let ons = [];
    if (!lodash_1.isArray(config.on[0])) {
        ons.push(config.on);
    }
    else {
        ons = config.on;
    }
    const on = lodash_1.map(ons, ([l, r]) => {
        return `${l(lcol)} = ${r(rcol)}`;
    }).join(',');
    let builder = lger.createQueryBuilder(ltn).leftJoinAndSelect(right, rtn, on).select(lodash_1.map(config.fields(lcol, rcol), (o, i) => {
        if (lodash_1.isObject(o)) {
            if (o.array === true) {
                return `GROUP_CONCAT(${i}) as ${o.field}`;
            }
            return `${i} as ${o.field}`;
        }
        return `${i} as ${o}`;
    }).join(','));
    const groupBy = config.groupBy(lcol, rcol);
    lodash_1.map(groupBy, by => builder = builder.groupBy(by));
    if (callback)
        builder = callback(builder, lcol, rcol);
    return builder;
}
exports.join = join;

//# sourceMappingURL=../../../sourcemaps/app/pandora/typeorm/orm.js.map
