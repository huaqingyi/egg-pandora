"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exception = exports.mount = exports.ExceptionThrown = void 0;
class ExceptionThrown {
    static mount(dto, config) {
        this._dto = dto;
        this._config = config;
        return this;
    }
    static exceper(action) {
        return async function (...props) {
            console.log(123123);
            const Dto = ExceptionThrown._dto;
            const resp = new Dto();
            try {
                const data = await action.apply(this, props);
                console.log(111, data);
                resp[ExceptionThrown._config.success] = data;
                this.ctx.body = resp;
            }
            catch (err) {
                console.log(333, err);
                resp[ExceptionThrown._config.error] = err;
                resp[ExceptionThrown._config.errmsg] = err.message;
            }
        };
    }
}
exports.ExceptionThrown = ExceptionThrown;
function mount(dto, config) {
    return ExceptionThrown.mount(dto, config);
}
exports.mount = mount;
function Exception(p, k, d) {
    if (k && d) {
        const action = p[k].bind(p);
        d.value = async (...props) => {
            console.log(123123);
            const Dto = ExceptionThrown._dto;
            const resp = new Dto();
            try {
                const data = await action.apply(p, props);
                console.log(111, data);
                resp[ExceptionThrown._config.success] = data;
                p.ctx.body = resp;
            }
            catch (err) {
                console.log(333, err);
                resp[ExceptionThrown._config.error] = err;
                resp[ExceptionThrown._config.errmsg] = err.message;
            }
        };
    }
    else {
        return (target, prototypeKey, descr) => {
            const action = target[prototypeKey].bind(target);
            descr.value = async (...props) => {
                console.log(123123);
                const Dto = ExceptionThrown._dto;
                const resp = new Dto();
                try {
                    const data = await action.apply(target, props);
                    console.log(111, data);
                    resp[ExceptionThrown._config.success] = data;
                    target.ctx.body = resp;
                }
                catch (err) {
                    console.log(333, err);
                    resp[ExceptionThrown._config.error] = err;
                    resp[ExceptionThrown._config.errmsg] = err.message;
                }
            };
        };
    }
}
exports.Exception = Exception;

//# sourceMappingURL=../../../sourcemaps/app/pandora/router/exception.js.map
