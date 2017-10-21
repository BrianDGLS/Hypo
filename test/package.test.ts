import {expect} from "chai";
import "mocha";

import {Container, IDependency} from "../lib/hypo";

describe("Hypo", () => {
  let dependency: IDependency;
  let dependencies: IDependency[];
  let container: Container;
  let cls: any;

  beforeEach(() => {
    dependencies = [
      {name: "TEST1", value: 1},
      {name: "TEST2", value: 2},
      {name: "TEST3", value: 3},
      {name: "TEST4", value: 4},
      {name: "TEST5", value: 5},
    ];
    container = new Container();
    dependencies.map((d) => container.register(d));
  });

  it("class should have injected dependency", () => {
    dependency = dependencies[0];

    @container.inject([dependency.name])
    class C {
    }

    cls = new C();
    expect(cls[dependency.name]).to.eq(dependency.value);
  });

  it("class should have getAll injected dependencies", () => {
    @container.inject(dependencies.map(({name}) => name))
    class C {
    }

    cls = new C();

    dependencies.map(({name, value}) => {
      expect(cls[name]).to.eq(value);
    });
  });
});
