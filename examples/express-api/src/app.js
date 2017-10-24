"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app_container_1 = require("./containers/app.container");
exports.app = express()
    .use("/", app_container_1.APP_CONTAINER.get("CarMakeController"))
    .use(app_container_1.APP_CONTAINER.get("404Handler"))
    .use(app_container_1.APP_CONTAINER.get("ErrorHandler"));
exports.app.listen(3000, function () {
    console.log("running on port 3000");
});
