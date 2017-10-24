"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var injector_1 = require("./injector");
var registry_1 = require("./registry");
var Container = /** @class */ (function () {
    function Container(registry, injector) {
        if (registry === void 0) { registry = new registry_1.Registry(); }
        if (injector === void 0) { injector = new injector_1.Injector(); }
        this.registry = registry;
        this.injector = injector;
    }
    Container.prototype.register = function (name, value) {
        this.registry.add({ name: name, value: value });
        return this;
    };
    Container.prototype.unregister = function (name) {
        this.registry.remove(name);
        return this;
    };
    Container.prototype.unregisterAll = function () {
        this.registry.removeAll();
        return this;
    };
    Container.prototype.get = function (name) {
        return this.registry.get(name).value;
    };
    Container.prototype.getAll = function () {
        return this.registry.getAll();
    };
    Container.prototype.inject = function (dependencyNames) {
        var _this = this;
        return function (cls) {
            _this.injector.inject(cls, dependencyNames.map(function (name) {
                var value = _this.get(name);
                return { name: name, value: value };
            }));
        };
    };
    Container.prototype.injectAll = function () {
        var _this = this;
        return function (cls) {
            _this.injector.inject(cls, _this.getAll());
        };
    };
    return Container;
}());
exports.Container = Container;
