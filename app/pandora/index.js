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
exports.bootstrap = void 0;
const swagger_1 = require("./swagger");
const typeorm_1 = require("./typeorm");
__exportStar(require("./swagger"), exports);
__exportStar(require("./aopImpl"), exports);
__exportStar(require("./router"), exports);
__exportStar(require("./typeorm"), exports);
exports.bootstrap = (app, config) => {
    swagger_1.swagger(app, config.swagger);
    if (config.typeorm !== false) {
        typeorm_1.typeorm(app);
    }
};

//# sourceMappingURL=../../sourcemaps/app/pandora/index.js.map
