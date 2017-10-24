"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("../../../../lib/express");
var car_make_controller_1 = require("../car-make/car-make.controller");
exports.APP_CONTAINER = new express_1.Container()
    .controller("CarMakeController", car_make_controller_1.CarMakeController)
    .register("404Handler", function (req, res, next) {
    var err = new Error("Not Found");
    var status = 404;
    next({ status: status, message: err.message });
})
    .register("ErrorHandler", function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.send(err);
});
