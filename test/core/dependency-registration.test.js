"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var registry_1 = require("../../lib/core/registry");
var mockDependencies = function () {
    return [
        { name: "TEST0", value: "0" },
        { name: "TEST1", value: "1" },
        { name: "TEST2", value: "2" },
        { name: "TEST3", value: "3" },
        { name: "TEST4", value: "4" },
    ];
};
describe("Core.Registry", function () {
    var subject;
    var dependency;
    beforeEach(function () {
        subject = new registry_1.Registry();
        dependency = mockDependencies()[0];
    });
    describe("#add", function () {
        it("should add a new dependency to the registry", function () {
            subject.add(dependency);
            chai_1.expect(subject.get(dependency.name)).to.deep.eq(dependency);
        });
        it("should throw error if dependency name already in registry", function () {
            subject.add(dependency);
            chai_1.expect(function () { return subject.add(dependency); }).to.throw();
        });
    });
    describe("#get", function () {
        beforeEach(function () {
            subject.add(dependency);
        });
        it("should throw error if dependency does not exist in registry", function () {
            chai_1.expect(function () { return subject.get("notInRegistry"); }).to.throw();
        });
        it("should return dependency with given name", function () {
            chai_1.expect(subject.get(dependency.name)).to.deep.eq(dependency);
        });
    });
    describe("#getAll", function () {
        it("should return all registered dependencies", function () {
            mockDependencies().forEach(function (d) {
                subject.add(d);
            });
            chai_1.expect(subject.getAll()).to.deep.eq(mockDependencies());
        });
    });
    describe("#remove", function () {
        beforeEach(function () {
            mockDependencies().forEach(function (d) {
                subject.add(d);
            });
        });
        it("should remove an existing dependency from the registry", function () {
            subject.remove(dependency.name);
            chai_1.expect(function () { return subject.get(dependency.name); }).to.throw();
        });
        it("should throw error if dependency is not in registry", function () {
            chai_1.expect(function () { return subject.remove("notInRegistry"); }).to.throw();
        });
    });
    describe("#removeAll", function () {
        it("should remove all dependencies from the registry", function () {
            mockDependencies().forEach(function (d) {
                subject.add(d);
            });
            subject.removeAll();
            chai_1.expect(subject.getAll()).to.deep.eq([]);
        });
    });
});
