'use strict';
var _a = require('../constants'), MIDDLEWARE_METADATA = _a.MIDDLEWARE_METADATA, METHOD_METADATA = _a.METHOD_METADATA, PATH_METADATA = _a.PATH_METADATA;
var RequestMethod = require('../enum/request-method');
var createMappingDecorator = Symbol('createMappingDecorator');
var createSingleDecorator = Symbol('createSingleDecorator');
var createArrayDecorator = Symbol('createArrayDecorator');
var mappingRequest = Symbol('mappingRequest');
var MethodHandler = /** @class */ (function () {
    function MethodHandler(cMap) {
        this.cMap = cMap;
    }
    MethodHandler.prototype.getMetada = function (targetCb) {
        var middlewares = Reflect.getMetadata(MIDDLEWARE_METADATA, targetCb) || [];
        var reqMethod = Reflect.getMetadata(METHOD_METADATA, targetCb);
        var path = Reflect.getMetadata(PATH_METADATA, targetCb);
        return {
            middlewares: middlewares,
            reqMethod: reqMethod,
            path: path
        };
    };
    MethodHandler.prototype.middleware = function () {
        return this[createArrayDecorator](MIDDLEWARE_METADATA);
    };
    MethodHandler.prototype.get = function () {
        return this[createMappingDecorator](RequestMethod.GET);
    };
    MethodHandler.prototype.post = function () {
        return this[createMappingDecorator](RequestMethod.POST);
    };
    MethodHandler.prototype.put = function () {
        return this[createMappingDecorator](RequestMethod.PUT);
    };
    MethodHandler.prototype.delete = function () {
        return this[createMappingDecorator](RequestMethod.DELETE);
    };
    MethodHandler.prototype.patch = function () {
        return this[createMappingDecorator](RequestMethod.PATCH);
    };
    MethodHandler.prototype.options = function () {
        return this[createMappingDecorator](RequestMethod.OPTIONS);
    };
    MethodHandler.prototype.head = function () {
        return this[createMappingDecorator](RequestMethod.HEAD);
    };
    MethodHandler.prototype.all = function () {
        return this[createMappingDecorator](RequestMethod.ALL);
    };
    MethodHandler.prototype[createMappingDecorator] = function (method) {
        var _this = this;
        return function (path) {
            var _a;
            return _this[mappingRequest]((_a = {},
                _a[PATH_METADATA] = path,
                _a[METHOD_METADATA] = method,
                _a));
        };
    };
    MethodHandler.prototype[mappingRequest] = function (metadata) {
        var _this = this;
        var path = metadata[PATH_METADATA];
        var reqMethod = metadata[METHOD_METADATA];
        return function (target, _key, descriptor) {
            _this.cMap.set(target, target);
            Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
            Reflect.defineMetadata(METHOD_METADATA, reqMethod, descriptor.value);
            return descriptor;
        };
    };
    MethodHandler.prototype[createSingleDecorator] = function (metadata) {
        var _this = this;
        return function (value) {
            return function (target, _key, descriptor) {
                _this.cMap.set(target, target);
                Reflect.defineMetadata(metadata, value, descriptor.value);
                return descriptor;
            };
        };
    };
    MethodHandler.prototype[createArrayDecorator] = function (metadata) {
        return function (values) {
            return function (_target, _key, descriptor) {
                var _values = Reflect.getOwnMetadata(metadata, descriptor.value) || [];
                values = (values instanceof Array) ? values : [values];
                values = values.concat(_values);
                Reflect.defineMetadata(metadata, values, descriptor.value);
                return descriptor;
            };
        };
    };
    return MethodHandler;
}());
module.exports = MethodHandler;

//# sourceMappingURL=../../../../../sourcemaps/app/pandora/router/src/handler/method-handler.js.map
