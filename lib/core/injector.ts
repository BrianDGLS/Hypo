import { IDependency } from "./dependency";

export interface IInjector {
  inject(cls: any, dependencies: IDependency[]): void;
}

export class Injector implements IInjector {
  public inject(cls: any, dependencies: IDependency[]) {
    dependencies.map(({ name, value }) => {
      cls[name] = value;
      cls.prototype[name] = value;
    });

    return class extends cls {};
  }
}

export const Inject = (providers: any[]): any => {
  return <T extends { new (...args: any[]): {} }>(cls: T) => {
    providers.map((provider: any) => {
      const value = new provider();
      const name = provider.name;
      (cls as any)[name] = value;
      cls.prototype[name] = value;
    });

    return class extends cls {};
  };
};
