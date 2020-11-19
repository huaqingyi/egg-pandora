"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PandoraForm = exports.Logic = void 0;
const egg_1 = require("egg");
const think_validator_1 = __importDefault(require("think-validator"));
const lodash_1 = require("lodash");
class Logic extends egg_1.Controller {
    constructor(ctx) {
        super(ctx);
        this.validator = new think_validator_1.default(ctx);
    }
    _rulesParse(rules) {
        const nrules = {};
        lodash_1.map(rules, (r, n) => {
            nrules[n] = r;
            if (r.method) {
                nrules[n].method = r.method.join(',');
            }
            return r;
        });
        return nrules;
    }
    validate(rules, msgs) {
        const ret = this.validator.validate(this._rulesParse(rules), msgs);
        if (lodash_1.isEmpty(ret)) {
            return true;
        }
        else {
            return ret;
        }
    }
}
exports.Logic = Logic;
exports.PandoraForm = {
    param(name) {
        if (name) {
            return this.request.query[name];
        }
        return this.request.query;
    },
    post(name) {
        if (name) {
            return this.request.body[name];
        }
        return this.request.body;
    },
    file(name) {
        if (name) {
            return lodash_1.find(this.request.files, ({ filename }) => filename === name);
        }
        return this.request.files;
    },
};

//# sourceMappingURL=../../../../sourcemaps/app/pandora/router/decorators/logic.js.map
