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
exports.swagger = void 0;
const document_1 = require("./document");
__exportStar(require("./document"), exports);
__exportStar(require("./constant"), exports);
exports.swagger = (app, config) => {
    return new document_1.Document(app, config);
};

//# sourceMappingURL=../../../sourcemaps/app/pandora/swagger/index.js.map
