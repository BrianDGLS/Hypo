"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var container_1 = require("../../lib/core/container");
var mockDependencies = function () {
    return [
        { name: "TEST0", value: "0" },
        { name: "TEST1", value: "1" },
        { name: "TEST2", value: "2" },
        { name: "TEST3", value: "3" },
        { name: "TEST4", value: "4" },
    ];
};
describe("Core.Container", function () {
    var subject;
    var dependency;
    beforeEach(function () {
        subject = new container_1.Container();
        dependency = mockDependencies()[0];
    });
    describe("#register", function () {
        it("should add dependency to internal registry", function () {
            chai_1.expect(subject
                .register(dependency.name, dependency.value)
                .get(dependency.name)).to.deep.eq(dependency.value);
        });
        it("should throw error if dependency name in registry", function () {
            chai_1.expect(function () { return subject
                .register(dependency.name, dependency.value)
                .register(dependency.name, dependency.value); }).to.throw();
        });
        it("should be a chainable function", function () {
            var dependencies = mockDependencies();
            subject
                .register(dependencies[0].name, dependencies[0].value)
                .register(dependencies[1].name, dependencies[1].value)
                .register(dependencies[2].name, dependencies[2].value)
                .register(dependencies[3].name, dependencies[3].value)
                .register(dependencies[4].name, dependencies[4].value);
            chai_1.expect(subject.get(dependencies[0].name)).to.deep.eq(dependencies[0].value);
            chai_1.expect(subject.get(dependencies[1].name)).to.deep.eq(dependencies[1].value);
            chai_1.expect(subject.get(dependencies[2].name)).to.deep.eq(dependencies[2].value);
            chai_1.expect(subject.get(dependencies[3].name)).to.deep.eq(dependencies[3].value);
            chai_1.expect(subject.get(dependencies[4].name)).to.deep.eq(dependencies[4].value);
        });
    });
    describe("#unregister", function () {
        it("should unregister an existing dependency", function () {
            subject
                .register(dependency.name, dependency.value)
                .unregister(dependency.name);
            chai_1.expect(function () { return subject.get(dependency.name); }).to.throw();
        });
        it("should throw error if dependency name not in registry", function () {
            chai_1.expect(function () { return subject.unregister(dependency.name); }).to.throw();
        });
        it("should be a chainable function", function () {
            var dependencies = mockDependencies();
            subject
                .register(dependencies[0].name, dependencies[0].value)
                .register(dependencies[1].name, dependencies[1].value)
                .unregister(dependencies[0].name)
                .unregister(dependencies[1].name);
            chai_1.expect(function () { return subject.get(dependencies[0].name); }).to.throw();
            chai_1.expect(function () { return subject.get(dependencies[1].name); }).to.throw();
        });
    });
    describe("#unregisterAll", function () {
        it("should remove all dependencies in registry", function () {
            mockDependencies().forEach(function (d) {
                subject.register(d.name, d.value);
            });
            chai_1.expect(subject.unregisterAll().getAll()).to.deep.eq([]);
        });
        it("should not throw error if registry is empty", function () {
            chai_1.expect(function () { return subject.unregisterAll(); }).not.to.throw();
        });
    });
    describe("#get", function () {
        it("should return dependency with given name", function () {
            chai_1.expect(subject
                .register(dependency.name, dependency.value)
                .get(dependency.name))
                .to.deep.eq(dependency.value);
        });
        it("should throw error if no dependency with given name", function () {
            chai_1.expect(function () { return subject.get("notInRegistry"); }).to.throw();
        });
        it("should throw error if no name given", function () {
            chai_1.expect(function () { return subject.get(""); }).to.throw();
        });
    });
    describe("#getAll", function () {
        it("should return all dependencies", function () {
            mockDependencies().forEach(function (d) {
                subject.register(d.name, d.value);
            });
            chai_1.expect(subject.getAll()).to.deep.eq(mockDependencies());
        });
        it("should return empty array if no dependencies", function () {
            chai_1.expect(subject.unregisterAll().getAll()).to.deep.eq([]);
        });
    });
    describe("#inject", function () {
        beforeEach(function () {
            mockDependencies().forEach(function (d) {
                subject.register(d.name, d.value);
            });
        });
        it("should inject dependency into class", function () {
            var C = /** @class */ (function () {
                function C() {
                }
                C = __decorate([
                    subject.inject([dependency.name])
                ], C);
                return C;
            }());
            var cls = new C();
            chai_1.expect(cls[dependency.name]).to.deep.eq(dependency.value);
        });
        it("should throw error if unknown dependency name", function () {
            chai_1.expect(function () {
                var C = /** @class */ (function () {
                    function C() {
                    }
                    C = __decorate([
                        subject.inject(["notInRegistry"])
                    ], C);
                    return C;
                }());
            }).to.throw();
        });
        it("should inject multiple dependencies", function () {
            var C = /** @class */ (function () {
                function C() {
                }
                C = __decorate([
                    subject.inject(mockDependencies().map(function (_a) {
                        var name = _a.name;
                        return name;
                    }))
                ], C);
                return C;
            }());
            var cls = new C();
            mockDependencies().forEach(function (d) {
                chai_1.expect(cls[d.name]).to.deep.eq(d.value);
            });
        });
    });
    describe("#injectAll", function () {
        beforeEach(function () {
            mockDependencies().forEach(function (d) {
                subject.register(d.name, d.value);
            });
        });
        it("should inject all registered dependencies", function () {
            var C = /** @class */ (function () {
                function C() {
                }
                C = __decorate([
                    subject.injectAll()
                ], C);
                return C;
            }());
            var cls = new C();
            mockDependencies().forEach(function (d) {
                chai_1.expect(cls[d.name]).to.deep.eq(d.value);
            });
        });
        it("should not throw error if no dependencies", function () {
            subject.unregisterAll();
            chai_1.expect(function () {
                var C = /** @class */ (function () {
                    function C() {
                    }
                    C = __decorate([
                        subject.injectAll()
                    ], C);
                    return C;
                }());
            }).to.not.throw();
        });
    });
});
