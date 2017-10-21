import {expect} from "chai";
import {Container} from "../lib/container";
import {IDependency} from "../lib/dependency";

const mockDependencies = (): IDependency[] => {
  return [
    {name: "TEST0", value: "0"},
    {name: "TEST1", value: "1"},
    {name: "TEST2", value: "2"},
    {name: "TEST3", value: "3"},
    {name: "TEST4", value: "4"},
  ];
};

describe("Hypo.Container", () => {
  let subject: Container;
  let dependency: IDependency;

  beforeEach(() => {
    subject = new Container();
    dependency = mockDependencies()[0];
  });

  describe("#register", () => {
    it("should add dependency to internal registry", () => {
      expect(subject.register(dependency).get(dependency.name)).to.deep.eq(dependency);
    });

    it("should throw error if dependency name in registry", () => {
      expect(() => subject.register(dependency).register(dependency)).to.throw();
    });

    it("should be a chainable function", () => {
      const dependencies = mockDependencies();

      subject
        .register(dependencies[0])
        .register(dependencies[1])
        .register(dependencies[2])
        .register(dependencies[3])
        .register(dependencies[4]);

      expect(subject.get(dependencies[0].name)).to.deep.eq(dependencies[0]);
      expect(subject.get(dependencies[1].name)).to.deep.eq(dependencies[1]);
      expect(subject.get(dependencies[2].name)).to.deep.eq(dependencies[2]);
      expect(subject.get(dependencies[3].name)).to.deep.eq(dependencies[3]);
      expect(subject.get(dependencies[4].name)).to.deep.eq(dependencies[4]);
    });
  });

  describe("#unregister", () => {
    it("should unregister an existing dependency", () => {
      subject
        .register(dependency)
        .unregister(dependency.name);

      expect(() => subject.get(dependency.name)).to.throw();
    });

    it("should throw error if dependency name not in registry", () => {
      expect(() => subject.unregister(dependency.name)).to.throw();
    });

    it("should be a chainable function", () => {
      const dependencies = mockDependencies();

      subject
        .register(dependencies[0])
        .register(dependencies[1])
        .unregister(dependencies[0].name)
        .unregister(dependencies[1].name);

      expect(() => subject.get(dependencies[0].name)).to.throw();
      expect(() => subject.get(dependencies[1].name)).to.throw();
    });
  });

  describe("#unregisterAll", () => {
    it("should remove all dependencies in registry", () => {
      mockDependencies().forEach((d: IDependency) => {
        subject.register(d);
      });

      expect(subject.unregisterAll().getAll()).to.deep.eq([]);
    });

    it("should not throw error if registry is empty", () => {
      expect(() => subject.unregisterAll()).not.to.throw();
    });
  });

  describe("#get", () => {
    it("should return dependency with given name", () => {
      expect(subject.register(dependency).get(dependency.name)).to.deep.eq(dependency);
    });

    it("should throw error if no dependency with given name", () => {
      expect(() => subject.get("notInRegistry")).to.throw();
    });

    it("should throw error if no name given", () => {
      expect(() => subject.get("")).to.throw();
    });
  });

  describe("#getAll", () => {
    it("should return all dependencies", () => {
      mockDependencies().forEach((d: IDependency) => {
        subject.register(d);
      });

      expect(subject.getAll()).to.deep.eq(mockDependencies());
    });

    it("should return empty array if no dependencies", () => {
      expect(subject.unregisterAll().getAll()).to.deep.eq([]);
    });
  });

  describe("#inject", () => {
    beforeEach(() => {
      mockDependencies().forEach((d: IDependency) => {
        subject.register(d);
      });
    });

    it("should inject dependency into class", () => {
      @subject.inject([dependency.name])
      class C {
      }

      const cls: any = new C();

      expect(cls[dependency.name]).to.deep.eq(dependency.value);
    });

    it("should throw error if unknown dependency name", () => {
      expect(() => {
        @subject.inject(["notInRegistry"])
        class C {
        }
      }).to.throw();
    });

    it("should inject multiple dependencies", () => {
      @subject.inject(mockDependencies().map(({name}) => name))
      class C {
      }

      const cls: any = new C();

      mockDependencies().forEach((d: IDependency) => {
        expect(cls[d.name]).to.deep.eq(d.value);
      });
    });
  });

  describe("#injectAll", () => {
    beforeEach(() => {
      mockDependencies().forEach((d: IDependency) => {
        subject.register(d);
      });
    });

    it("should inject all registered dependencies", () => {
      @subject.injectAll()
      class C {
      }

      const cls: any = new C();

      mockDependencies().forEach((d: IDependency) => {
        expect(cls[d.name]).to.deep.eq(d.value);
      });
    });

    it("should not throw error if no dependencies", () => {
      subject.unregisterAll();

      expect(() => {
        @subject.injectAll()
        class C {
        }
      }).to.not.throw();
    });
  });
});
