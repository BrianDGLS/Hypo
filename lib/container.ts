import { Registry } from './registry'
import { Injector } from './injector'
import { Dependency } from './dependency'

export class Container {
  public constructor (private _registry: Registry = new Registry(),
                      private _injector: Injector = new Injector()) {}

  public register (dependency: Dependency): Container {
    this._registry.add(dependency)
    return this
  }

  public get (name: string): Dependency {
    return this._registry.get(name)
  }

  public inject (dependencyNames: string[]): any {
    return <T extends { new(...args: any[]): {} }> (cls: T) => {
      this._injector.inject(cls, dependencyNames.map(this.get.bind(this)))
    }
  }
}
