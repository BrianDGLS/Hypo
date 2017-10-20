"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var hypo_1 = require("../lib/hypo");
describe('Hypo', function () {
    var dependency;
    var dependencies;
    var container;
    var cls;
    beforeEach(function () {
        dependencies = [
            { name: 'TEST1', value: 1 },
            { name: 'TEST2', value: 2 },
            { name: 'TEST3', value: 3 },
            { name: 'TEST4', value: 4 },
            { name: 'TEST5', value: 5 },
        ];
        container = new hypo_1.Container();
        dependencies.map(function (d) { return container.register(d); });
    });
    it('class should have injected dependency', function () {
        dependency = dependencies[0];
        var C = /** @class */ (function () {
            function C() {
            }
            C = __decorate([
                container.inject([dependency.name])
            ], C);
            return C;
        }());
        cls = new C();
        chai_1.expect(cls[dependency.name]).to.eq(dependency.value);
    });
    it('class should have all injected dependencies', function () {
        var C = /** @class */ (function () {
            function C() {
            }
            C = __decorate([
                container.inject(dependencies.map(function (_a) {
                    var name = _a.name;
                    return name;
                }))
            ], C);
            return C;
        }());
        cls = new C();
        dependencies.map(function (_a) {
            var name = _a.name, value = _a.value;
            chai_1.expect(cls[name]).to.eq(value);
        });
    });
});
describe('Hypo.Container', function () {
    var dependency;
    var dependencies;
    var container;
    beforeEach(function () {
        dependencies = [
            { name: 'TEST1', value: 1 },
            { name: 'TEST2', value: 2 },
            { name: 'TEST3', value: 3 },
            { name: 'TEST4', value: 4 },
            { name: 'TEST5', value: 5 },
        ];
        container = new hypo_1.Container();
    });
    describe('#register', function () {
        it('should add dependency to internal registry', function () {
            dependency = dependencies[0];
            chai_1.expect(container.register(dependency).get(dependency.name)).to.deep.eq(dependency);
        });
        it('should be a chainable function', function () {
            container
                .register(dependencies[0])
                .register(dependencies[1])
                .register(dependencies[2])
                .register(dependencies[3]);
            chai_1.expect(container.get(dependencies[0].name)).to.deep.eq(dependencies[0]);
            chai_1.expect(container.get(dependencies[1].name)).to.deep.eq(dependencies[1]);
            chai_1.expect(container.get(dependencies[2].name)).to.deep.eq(dependencies[2]);
            chai_1.expect(container.get(dependencies[3].name)).to.deep.eq(dependencies[3]);
        });
    });
});
describe('Hypo.Injector', function () {
});
describe('Hypo.Registry', function () {
    var subject;
    var dependency;
    describe('#get', function () {
        beforeEach(function () {
            subject = new hypo_1.Registry();
            dependency = { name: 'foo', value: 'bar' };
            subject.add(dependency);
        });
        it('should throw error if dependency does not exist in registry', function () {
            chai_1.expect(function () { return subject.get('test'); }).to.throw();
        });
        it('should return dependency with given name', function () {
            chai_1.expect(subject.get(dependency.name)).to.deep.eq(dependency);
        });
    });
    describe('#add', function () {
        beforeEach(function () {
            subject = new hypo_1.Registry();
            dependency = { name: 'foo', value: 'bar' };
        });
        it('should add a new dependency to the registry', function () {
            subject.add(dependency);
            chai_1.expect(subject.get(dependency.name)).to.deep.eq(dependency);
        });
        it('should throw error if dependency already in registry', function () {
            subject.add(dependency);
            chai_1.expect(function () { return subject.add(dependency); }).to.throw();
        });
    });
    describe('#remove', function () {
        beforeEach(function () {
            subject = new hypo_1.Registry();
            dependency = { name: 'foo', value: 'bar' };
            subject.add(dependency);
        });
        it('should remove an existing dependency from the registry', function () {
            subject.remove(dependency.name);
            chai_1.expect(function () { return subject.get(dependency.name); }).to.throw();
        });
        it('should throw error if dependency is not in registry', function () {
            chai_1.expect(function () { return subject.remove('foobar'); }).to.throw();
        });
    });
    describe('#all', function () {
        beforeEach(function () {
            subject = new hypo_1.Registry();
        });
        it('should return all dependencies in the registry', function () {
            var len = 10;
            var i = len;
            while (i--) {
                subject.add({ name: 'foo' + i, value: 'bar' });
            }
            chai_1.expect(subject.all().length).to.eq(len);
        });
    });
    describe('#clear', function () {
        beforeEach(function () {
            subject = new hypo_1.Registry();
            dependency = { name: 'foo', value: 'bar' };
            subject.add(dependency);
        });
        it('should remove all dependencies from the registry', function () {
            subject.clear();
            chai_1.expect(subject.all().length).to.eq(0);
        });
    });
});
