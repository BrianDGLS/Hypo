"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Injector = /** @class */ (function () {
    function Injector() {
    }
    Injector.prototype.inject = function (cls, dependencies) {
        dependencies.map(function (_a) {
            var name = _a.name, value = _a.value;
            cls[name] = value;
            cls.prototype[name] = value;
        });
        return /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return class_1;
        }(cls));
    };
    return Injector;
}());
exports.Injector = Injector;
