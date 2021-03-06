export declare class Map {
  clear(): void
  delete(key: any): boolean
  forEach(callbackfn: (value: any, key: any, target: any) => void): void
  get(key: any): any
  has(key: any): boolean
  set(key: any, val: any): this
  size: number
}

export class ContainerService {
  private serviceInstance: any

  constructor(
    protected container: Container,
    protected serviceCreationCallback: (container: Container) => any
  ) {}

  get(): any {
    if (this.serviceInstance) {
      return this.serviceInstance
    }

    this.serviceInstance = this.serviceCreationCallback(this.container)
    return this.serviceInstance
  }

  raw(): (container: Container) => any {
    return this.serviceCreationCallback
  }
}

export class FactoryContainerService extends ContainerService {
  get(): any {
    return this.serviceCreationCallback(this.container)
  }
}

export class ProtectedParameter extends ContainerService {
  private value: any

  constructor(
    protected container: Container,
    protected serviceCreationCallback: (container: Container) => any
  ) {
    super(container, serviceCreationCallback)
    this.value = this.serviceCreationCallback(this.container)
  }

  get(): any {
    return this.value
  }
}

export class Container {
  [key: string]: any

  public registry = new Map()

  register(
    service: string | Container,
    serviceCreationCallback?:
      | ((container: Container) => any)
      | FactoryContainerService
      | ProtectedParameter
  ): Container {
    if (service && typeof service === 'string') {
      this.throwIfServiceAlreadyRegistered(service)
      this.throwIfServiceCreationCallbackNotSupplied(serviceCreationCallback)

      if (serviceCreationCallback instanceof FactoryContainerService) {
        this.registry.set(service, serviceCreationCallback)
      } else if (serviceCreationCallback instanceof ProtectedParameter) {
        this.throwIfParameterAlreadyRegistered(service)
        ;(Object as any).assign(this, {
          get [service as string]() {
            return (serviceCreationCallback as any).get()
          }
        })
      } else {
        this.registry.set(
          service,
          new ContainerService(this, serviceCreationCallback as any)
        )
      }
    } else if (service instanceof Container) {
      service.registry.forEach((value: any, key: any) => {
        this.register(key, value.raw())
      })
    } else {
      this.throwIfInvalidServiceType()
    }

    return this
  }

  factory(
    serviceCreationCallback: (container: Container) => any
  ): FactoryContainerService {
    return new FactoryContainerService(this, serviceCreationCallback)
  }

  protect(
    parameterCreationCallback: (container: Container) => any
  ): ProtectedParameter {
    return new ProtectedParameter(this, parameterCreationCallback)
  }

  get(service: string): any {
    this.throwIfNotInRegistry(service)
    return this.registry.get(service).get()
  }

  extend(
    service: string,
    extensionCallback: (storage: any, container: Container) => any
  ): any {
    this.throwIfNotInRegistry(service)

    const serviceMethod = this.get(service)
    extensionCallback(serviceMethod, this)
  }

  raw(service: string): any {
    this.throwIfNotInRegistry(service)
    return this.registry.get(service).raw()
  }

  delete(service: string): void {
    if (this.registry.has(service)) {
      this.registry.delete(service)
    }
  }

  deleteAll(): void {
    this.registry.clear()
  }

  private throwIfServiceAlreadyRegistered(service: string): void {
    if (this.registry.has(service)) {
      throw new Error(
        `${service} has already been registered, user unique service name`
      )
    }
  }

  private throwIfParameterAlreadyRegistered(parameter: string): void {
    if (this.hasOwnProperty(parameter)) {
      throw new Error(
        `${parameter} has already been registered, user unique parameter name`
      )
    }
  }

  private throwIfServiceCreationCallbackNotSupplied(callback: any): void {
    if (!callback) {
      throw new Error(
        `callback must be supplied when registering a service or protected parameter`
      )
    }
  }

  private throwIfNotInRegistry(service: string): void {
    if (!this.registry.has(service)) {
      throw new Error(`${service} not in registry`)
    }
  }

  private throwIfInvalidServiceType(): void {
    throw new Error(`service must be of type string or Container`)
  }
}
