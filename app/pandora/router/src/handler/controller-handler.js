"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var constants_1 = require("../constants");
var createArrayDecorator = Symbol('createArrayDecorator');
var createSingleDecorator = Symbol('createSingleDecorator');
var createCoupleDecorator = Symbol('createCoupleDecorator');
var ControllerHandler = /** @class */ (function () {
    function ControllerHandler() {
    }
    ControllerHandler.prototype.prefix = function () {
        return this[createSingleDecorator](constants_1.CONTROLLER_PREFIX_METADATA);
    };
    ControllerHandler.prototype.getMetada = function (target) {
        var prefix = Reflect.getMetadata(constants_1.CONTROLLER_PREFIX_METADATA, target);
        var renderController = Reflect.getMetadata(constants_1.CONTROLLER_RENDER_METADATA, target);
        return {
            prefix: prefix,
            renderController: renderController
        };
    };
    ControllerHandler.prototype[createSingleDecorator] = function (metadata) {
        return function (value) {
            return function (target) {
                Reflect.defineMetadata(metadata, value, target);
            };
        };
    };
    ControllerHandler.prototype[createCoupleDecorator] = function (metadata) {
        return function (value1, value2) {
            return function (target) {
                Reflect.defineMetadata(metadata, {
                    name: value2,
                    description: value1
                }, target);
            };
        };
    };
    ControllerHandler.prototype[createArrayDecorator] = function (metadata) {
        return function (values) {
            return function (target) {
                var _values = Reflect.getMetadata(metadata, target) || [];
                values = (values instanceof Array) ? values : [values];
                values = values.concat(_values);
                Reflect.defineMetadata(metadata, values, target);
            };
        };
    };
    return ControllerHandler;
}());
module.exports = ControllerHandler;

//# sourceMappingURL=../../../../../sourcemaps/app/pandora/router/src/handler/controller-handler.js.map
