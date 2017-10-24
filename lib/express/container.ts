import * as Core from "../core";
import {IControllerConstructor} from "./controller";
import {IServiceConstructor} from "./service";

export class Container extends Core.Container {
  public controller(name: string, controller: IControllerConstructor): Container {
    this.register(name, new controller().getRouter());
    return this;
  }

  public service(name: string, service: IServiceConstructor<any>): Container {
    this.register(name, new service());
    return this;
  }
}
