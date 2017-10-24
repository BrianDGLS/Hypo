"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("../../../../lib/express");
var car_make_service_1 = require("../car-make/car-make.service");
exports.SERVICE_CONTAINER = new express_1.Container()
    .service("CarMakeService", car_make_service_1.CarMakeService);
