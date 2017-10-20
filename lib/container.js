"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var registry_1 = require("./registry");
var injector_1 = require("./injector");
var Container = /** @class */ (function () {
    function Container(_registry, _injector) {
        if (_registry === void 0) { _registry = new registry_1.Registry(); }
        if (_injector === void 0) { _injector = new injector_1.Injector(); }
        this._registry = _registry;
        this._injector = _injector;
    }
    Container.prototype.register = function (dependency) {
        this._registry.add(dependency);
        return this;
    };
    Container.prototype.get = function (name) {
        return this._registry.get(name);
    };
    Container.prototype.inject = function (dependencyNames) {
        var _this = this;
        return function (cls) {
            _this._injector.inject(cls, dependencyNames.map(_this.get.bind(_this)));
        };
    };
    return Container;
}());
exports.Container = Container;
