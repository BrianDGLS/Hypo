import {expect} from "chai";
import "mocha";
import {IDependency} from "../../lib/core/dependency";
import {Registry} from "../../lib/core/registry";

const mockDependencies = (): IDependency[] => {
  return [
    {name: "TEST0", value: "0"},
    {name: "TEST1", value: "1"},
    {name: "TEST2", value: "2"},
    {name: "TEST3", value: "3"},
    {name: "TEST4", value: "4"},
  ];
};

describe("Core.Registry", () => {
  let subject: Registry;
  let dependency: IDependency;

  beforeEach(() => {
    subject = new Registry();
    dependency = mockDependencies()[0];
  });

  describe("#add", () => {
    it("should add a new dependency to the registry", () => {
      subject.add(dependency);
      expect(subject.get(dependency.name)).to.deep.eq(dependency);
    });

    it("should throw error if dependency name already in registry", () => {
      subject.add(dependency);
      expect(() => subject.add(dependency)).to.throw();
    });
  });

  describe("#get", () => {
    beforeEach(() => {
      subject.add(dependency);
    });

    it("should throw error if dependency does not exist in registry", () => {
      expect(() => subject.get("notInRegistry")).to.throw();
    });

    it("should return dependency with given name", () => {
      expect(subject.get(dependency.name)).to.deep.eq(dependency);
    });
  });

  describe("#getAll", () => {
    it("should return all registered dependencies", () => {
      mockDependencies().forEach((d: IDependency) => {
        subject.add(d);
      });

      expect(subject.getAll()).to.deep.eq(mockDependencies());
    });
  });

  describe("#remove", () => {
    beforeEach(() => {
      mockDependencies().forEach((d: IDependency) => {
        subject.add(d);
      });
    });

    it("should remove an existing dependency from the registry", () => {
      subject.remove(dependency.name);
      expect(() => subject.get(dependency.name)).to.throw();
    });

    it("should throw error if dependency is not in registry", () => {
      expect(() => subject.remove("notInRegistry")).to.throw();
    });
  });

  describe("#removeAll", () => {
    it("should remove all dependencies from the registry", () => {
      mockDependencies().forEach((d: IDependency) => {
        subject.add(d);
      });

      subject.removeAll();
      expect(subject.getAll()).to.deep.eq([]);
    });
  });
});
