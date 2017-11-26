import { IDependency } from "./dependency";
import { IInjector, Injector } from "./injector";
import { IRegistry, Registry } from "./registry";

export interface IContainer<T> {
  register(name: string, value: any): T;

  unregister(name: string): T;

  unregisterAll(): T;

  get(name: string): any;

  getAll(): IDependency[];

  inject(dependencyNames: string[]): any;

  injectAll(): any;
}

export class Container implements IContainer<Container> {
  public constructor(
    private registry: IRegistry = new Registry(),
    private injector: IInjector = new Injector()
  ) {}

  public register(name: string, value: any): Container {
    this.registry.add({ name, value });
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

  public get(name: string): any {
    return this.registry.get(name).value;
  }

  public getAll(): any[] {
    return this.registry.getAll();
  }

  public inject(dependencyNames: string[]): any {
    return <T extends { new (...args: any[]): {} }>(cls: T) => {
      this.injector.inject(
        cls,
        dependencyNames.map((name: string) => {
          const value = this.get(name);
          return { name, value };
        })
      );
    };
  }

  public injectAll(): any {
    return <T extends { new (...args: any[]): {} }>(cls: T) => {
      this.injector.inject(cls, this.getAll());
    };
  }
}
