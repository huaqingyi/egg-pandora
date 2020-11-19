"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AOP = void 0;
const class_validator_1 = require("class-validator");
const class_validator_jsonschema_1 = require("class-validator-jsonschema");
const lodash_1 = require("lodash");
exports.AOP = {
    schema(someClass) {
        if (!someClass) {
            return class_validator_jsonschema_1.validationMetadatasToSchemas();
        }
        return someClass.schema();
    },
    async vaildAOP(someClass, data) {
        const some = new someClass();
        lodash_1.map(data, (o, i) => { some[i] = o; });
        return class_validator_1.validate(some);
    }
};

//# sourceMappingURL=../../../sourcemaps/app/pandora/aopImpl/aop.js.map
