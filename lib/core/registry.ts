import { IDependency } from "./dependency";

export interface IRegistry {
  add({ name, value }: IDependency): void;

  get(name: string): IDependency;

  getAll(): IDependency[];

  remove(name: string): void;

  removeAll(): void;
}

export class Registry implements IRegistry {
  private registry = new Map<string, any>();

  public add({ name, value }: IDependency): void {
    if (this.registry.get(name)) {
      throw new Error(`[Registry#add]: [name:${name}] exists in registry.`);
    }

    this.registry.set(name, value);
  }

  public get(name: string): IDependency {
    const value = this.registry.get(name);
    if (value) {
      return { name, value };
    }

    throw new Error(
      `[Registry#get]: [name:${name}] does not exist in registry.`
    );
  }

  public getAll(): IDependency[] {
    return Array.from(this.registry.keys()).map(this.get.bind(this));
  }

  public remove(name: string): void {
    if (this.registry.get(name) === undefined) {
      throw new Error(
        `[Registry#remove]: [name:${name}] does not exist in registry.`
      );
    }

    this.registry.delete(name);
  }

  public removeAll(): void {
    this.registry.clear();
  }
}
