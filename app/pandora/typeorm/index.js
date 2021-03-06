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
exports.typeorm = void 0;
const core_1 = require("./core");
exports.typeorm = async (app) => {
    let config;
    try {
        config = app.config.typeorm;
    }
    catch (err) { }
    if (config) {
        app.beforeStart(async () => {
            try {
                const core = new core_1.Core(app);
                await core.connectDB();
                app.logger.info('[typeorm]', '数据链接成功');
            }
            catch (error) {
                app.logger.error('[typeorm]', '数据库链接失败');
                app.logger.error(error);
            }
        });
    }
};
__exportStar(require("./core"), exports);
__exportStar(require("./orm"), exports);
__exportStar(require("./context"), exports);

//# sourceMappingURL=../../../sourcemaps/app/pandora/typeorm/index.js.map
