"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Registry = /** @class */ (function () {
    function Registry() {
        this._registry = new Map();
    }
    Registry.prototype.all = function () {
        return Array.from(this._registry.keys()).map(this.get.bind(this));
    };
    Registry.prototype.get = function (name) {
        var value = this._registry.get(name);
        if (value) {
            return { name: name, value: value };
        }
        throw new Error("[Registry#get]: [name:" + name + "] does not exist in registry.");
    };
    Registry.prototype.add = function (_a) {
        var name = _a.name, value = _a.value;
        if (this._registry.get(name)) {
            throw new Error("[Registry#add]: [name:" + name + "] exists in registry.");
        }
        this._registry.set(name, value);
    };
    Registry.prototype.remove = function (name) {
        if (this._registry.get(name) === undefined) {
            throw new Error("[Registry#remove]: [name:" + name + "] does not exist in registry.");
        }
        this._registry.delete(name);
    };
    Registry.prototype.clear = function () {
        this._registry.clear();
    };
    return Registry;
}());
exports.Registry = Registry;
