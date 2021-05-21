"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABefore = exports.Before = void 0;
const preconst_1 = require("../preconst");
function Before(...middleware) {
    return (target) => {
        target[preconst_1.PANDORACONTROLMIDLE] = middleware;
    };
}
exports.Before = Before;
function ABefore(...middleware) {
    return (target, prototypeKey) => {
        const actionsall = target.constructor[preconst_1.PANDORAACTIONMIDLE] || {};
        const actions = actionsall[prototypeKey] || [];
        actions.push(...middleware);
        actionsall[prototypeKey] = actions;
        target.constructor[preconst_1.PANDORAACTIONMIDLE] = actionsall;
    };
}
exports.ABefore = ABefore;

//# sourceMappingURL=../../../../sourcemaps/app/pandora/router/decorators/before.js.map
