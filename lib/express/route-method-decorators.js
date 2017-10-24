"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var controller_1 = require("./controller");
var isController = function (obj) { return obj instanceof controller_1.Controller; };
var validUrl = function (url) { return typeof url === "string"; };
var executeDecorator = function (fnName, url) {
    return function (target, propertyKey, descriptor) {
        var decoratorMethods = ["get", "put", "post", "delete"];
        var action = decoratorMethods.find(function (fn) { return fnName.toLowerCase() === fn; });
        if (!isController(target)) {
            throw new Error("[@" + fnName + "]: target class must be instance of Controller.");
        }
        if (!validUrl(url)) {
            throw new Error("[@" + fnName + "(" + url + ")]: supplied url must be of type string.");
        }
        if (action) {
            target.getRouter()[action](url, descriptor.value.bind(target));
        }
        else {
            throw new Error("[executeDecorator]: unknown function name: " + fnName + ".");
        }
    };
};
exports.Get = function (url) {
    return function (target, propertyKey, descriptor) {
        executeDecorator("Get", url)(target, propertyKey, descriptor);
    };
};
exports.Post = function (url) {
    return function (target, propertyKey, descriptor) {
        executeDecorator("Post", url)(target, propertyKey, descriptor);
    };
};
exports.Put = function (url) {
    return function (target, propertyKey, descriptor) {
        executeDecorator("Put", url)(target, propertyKey, descriptor);
    };
};
exports.Delete = function (url) {
    return function (target, propertyKey, descriptor) {
        executeDecorator("Delete", url)(target, propertyKey, descriptor);
    };
};
