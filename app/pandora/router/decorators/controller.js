"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestMapping = exports.parserm = exports.RestController = exports.RequestMethod = void 0;
const lodash_1 = require("lodash");
const core_1 = require("../core");
const preconst_1 = require("../preconst");
var RequestMethod;
(function (RequestMethod) {
    RequestMethod["GET"] = "GET";
    RequestMethod["POST"] = "POST";
    RequestMethod["PUT"] = "PUT";
    RequestMethod["DELETE"] = "DELETE";
    RequestMethod["PATCH"] = "PATCH";
    RequestMethod["OPTIONS"] = "OPTIONS";
    RequestMethod["HEAD"] = "HEAD";
    RequestMethod["ALL"] = "ALL";
})(RequestMethod = exports.RequestMethod || (exports.RequestMethod = {}));
function RestController(props) {
    if (lodash_1.isString(props)) {
        return (target) => {
            target[preconst_1.PANDORAROUTER] = props;
            target[preconst_1.PANDORAROUTEREABLE] = true;
            core_1.pandorouter.routes.push(target);
            return target;
        };
    }
    else {
        props[preconst_1.PANDORAROUTEREABLE] = true;
        core_1.pandorouter.routes.push(props);
        return props;
    }
}
exports.RestController = RestController;
;
function parserm(config, target, key, descr) {
    if (!config.path) {
        config.path = key;
    }
    if (!config.methods) {
        config.methods = [RequestMethod.ALL];
    }
    if (!target.constructor[preconst_1.PANDORAROUTES]) {
        target.constructor[preconst_1.PANDORAROUTES] = [];
    }
    target.constructor[preconst_1.PANDORAROUTES].push({ config, action: descr.value, name: key });
}
exports.parserm = parserm;
function RequestMapping(...props) {
    if (props[1]) {
        const [target, key, descr] = props;
        parserm({}, target, key, descr);
    }
    else {
        return (target, key, descr) => {
            const [config] = props;
            parserm(config, target, key, descr);
        };
    }
}
exports.RequestMapping = RequestMapping;

//# sourceMappingURL=../../../../sourcemaps/app/pandora/router/decorators/controller.js.map
