import {IDependency} from "./dependency";
import {IInjector, Injector} from "./injector";
import {IRegistry, Registry} from "./registry";

export interface IContainer<T> {
  register(dependency: IDependency): T;

  unregister(name: string): T;

  unregisterAll(): T;

  get(name: string): IDependency;

  getAll(): IDependency[];

  inject(dependencyNames: string[]): any;

  injectAll(): any;
}

export class Container implements IContainer<Container> {
  public constructor(private registry: IRegistry = new Registry(),
                     private injector: IInjector = new Injector()) {
  }

  public register(dependency: IDependency): Container {
    this.registry.add(dependency);
    return this;
  }

  public unregister(name: string): Container {
    this.registry.remove(name);
    return this;
  }

  public unregisterAll(): Container {
    this.registry.removeAll();
    return this;
  }

  public get(name: string): IDependency {
    return this.registry.get(name);
  }

  public getAll(): IDependency[] {
    return this.registry.getAll();
  }

  public inject(dependencyNames: string[]): any {
    return <T extends { new(...args: any[]): {} }>(cls: T) => {
      this.injector.inject(cls, dependencyNames.map(this.get.bind(this)));
    };
  }

  public injectAll(): any {
    return <T extends { new(...args: any[]): {} }>(cls: T) => {
      this.injector.inject(cls, this.getAll());
    };
  }
}
