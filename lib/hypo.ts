class FactoryCallback {
  __factory = true

  constructor(public callback: (container: Container) => any) {}
}

export class Container {
  private rawRegistry = new Map<string, any>()
  public registry = new Map<string, any>()

  register(service: string | any, callback?: any): Container {
    if (callback && callback instanceof FactoryCallback) {
      this.rawRegistry.set(service, callback)
      this.registry.set(service, callback)
    } else {
      switch (typeof service) {
        case 'string':
          this.rawRegistry.set(service, callback)
          this.registry.set(service, callback(this))
          break
        case 'function':
          this.rawRegistry.set(service.name, service)
          this.registry.set(service.name, service(this))
          break
        default:
          throw new Error('Dependency must be of type string or function')
      }
    }
    return this
  }

  factory(callback: (container: Container) => any): FactoryCallback {
    return new FactoryCallback(callback)
  }

  get(dependency: string): any {
    if (this.registry.has(dependency)) {
      const dependencyMethod = this.registry.get(dependency)

      if (dependencyMethod && dependencyMethod instanceof FactoryCallback) {
        return dependencyMethod.callback(this)
      }

      return dependencyMethod
    }
  }

  delete(dependency: string): void {
    if (this.registry.has(dependency)) {
      this.registry.delete(dependency)
    }
  }

  deleteAll(): void {
    this.registry.clear()
  }

  raw(service: string): any {
    if (this.rawRegistry.has(service)) {
      return this.rawRegistry.get(service)
    }
  }
}
