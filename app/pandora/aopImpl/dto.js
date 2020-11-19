"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dto = void 0;
const class_validator_jsonschema_1 = require("class-validator-jsonschema");
class Dto {
    static schema() {
        return class_validator_jsonschema_1.validationMetadatasToSchemas()[this.name];
    }
}
exports.Dto = Dto;

//# sourceMappingURL=../../../sourcemaps/app/pandora/aopImpl/dto.js.map
