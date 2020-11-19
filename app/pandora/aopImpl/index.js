"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aop = void 0;
const aop_1 = require("./aop");
__exportStar(require("./aop"), exports);
__exportStar(require("./dto"), exports);
__exportStar(require("class-validator"), exports);
__exportStar(require("class-validator-jsonschema"), exports);
exports.aop = (app) => {
    return new aop_1.AOP(app);
};

//# sourceMappingURL=../../../sourcemaps/app/pandora/aopImpl/index.js.map
