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
exports.router = void 0;
require("reflect-metadata");
const core_1 = require("./core");
__exportStar(require("./decorators"), exports);
exports.router = (app) => {
    return core_1.pandorouter.bootstrap(app, app.config.pandora.router || { enable: false });
};

//# sourceMappingURL=../../../sourcemaps/app/pandora/router/index.js.map
