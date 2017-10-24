"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var DB = JSON.parse(fs_1.readFileSync(path_1.join(__dirname, "../..", "db.json"), "utf8"));
var CarMakeService = /** @class */ (function () {
    function CarMakeService() {
    }
    CarMakeService.prototype.allMakes = function () {
        return DB.Makes;
    };
    CarMakeService.prototype.getMakeById = function (id) {
        return DB.Makes.find(function (_a) {
            var make_id = _a.make_id;
            return make_id === id;
        });
    };
    return CarMakeService;
}());
exports.CarMakeService = CarMakeService;
