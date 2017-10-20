import { Dependency } from './dependency'

export class Injector {
  public constructor () {}

  public inject (cls: any, dependencies: Dependency[]) {
    dependencies.map(({name, value}) => {
      cls[name] = value
      cls.prototype[name] = value
    })

    return class extends cls {}
  }
}
