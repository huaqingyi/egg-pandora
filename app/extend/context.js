"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pandora_1 = require("../pandora");
const aop_1 = require("../pandora/aopImpl/aop");
const typeorm_1 = require("../pandora/typeorm");
exports.default = {
    ...aop_1.AOP,
    ...pandora_1.PandoraForm,
    ...typeorm_1.TypeORM,
};

//# sourceMappingURL=../../sourcemaps/app/extend/context.js.map
