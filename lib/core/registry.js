"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Registry = /** @class */ (function () {
    function Registry() {
        this.registry = new Map();
    }
    Registry.prototype.add = function (_a) {
        var name = _a.name, value = _a.value;
        if (this.registry.get(name)) {
            throw new Error("[Registry#add]: [name:" + name + "] exists in registry.");
        }
        this.registry.set(name, value);
    };
    Registry.prototype.get = function (name) {
        var value = this.registry.get(name);
        if (value) {
            return { name: name, value: value };
        }
        throw new Error("[Registry#get]: [name:" + name + "] does not exist in registry.");
    };
    Registry.prototype.getAll = function () {
        return Array.from(this.registry.keys()).map(this.get.bind(this));
    };
    Registry.prototype.remove = function (name) {
        if (this.registry.get(name) === undefined) {
            throw new Error("[Registry#remove]: [name:" + name + "] does not exist in registry.");
        }
        this.registry.delete(name);
    };
    Registry.prototype.removeAll = function () {
        this.registry.clear();
    };
    return Registry;
}());
exports.Registry = Registry;
