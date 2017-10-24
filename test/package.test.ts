import {expect} from "chai";
import "mocha";

import {Core, Express} from "../lib/hypo";

describe("Hypo", () => {
  it("Core package classes should be exported", () => {
    expect(Core.Container).to.not.eq(undefined);
    expect(Core.Registry).to.not.eq(undefined);
    expect(Core.Injector).to.not.eq(undefined);
  });

  it("Express package classes should be exported", () => {
    expect(Express.Container).to.not.eq(undefined);
    expect(Express.Controller).to.not.eq(undefined);
    // method decorators
    expect(Express.Get).to.not.eq(undefined);
    expect(Express.Put).to.not.eq(undefined);
    expect(Express.Post).to.not.eq(undefined);
    expect(Express.Delete).to.not.eq(undefined);
  });
});
