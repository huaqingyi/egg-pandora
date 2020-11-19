"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AOP = void 0;
const class_validator_1 = require("class-validator");
const class_validator_jsonschema_1 = require("class-validator-jsonschema");
const lodash_1 = require("lodash");
class AOP {
    constructor(app) {
        this.app = app;
        this.buildAOP(this.app);
    }
    buildAOP(app) {
        app.context.schema = this.classToSchema.bind(this);
        app.context.vaildAOP = this.vaildAOP.bind(this);
    }
    classToSchema(someClass) {
        if (!someClass) {
            return class_validator_jsonschema_1.validationMetadatasToSchemas();
        }
        return someClass.schema();
    }
    async vaildAOP(someClass, data) {
        const some = new someClass();
        lodash_1.map(data, (o, i) => { some[i] = o; });
        return class_validator_1.validate(some);
    }
}
exports.AOP = AOP;

//# sourceMappingURL=../../../sourcemaps/app/pandora/aopImpl/aop.js.map
