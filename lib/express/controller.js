"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var Controller = /** @class */ (function () {
    function Controller() {
    }
    Controller.prototype.getRouter = function () {
        if (!this.router) {
            this.router = express_1.Router();
        }
        return this.router;
    };
    return Controller;
}());
exports.Controller = Controller;
