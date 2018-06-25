class ContainerService {
  private serviceInstance: any

  constructor(
    protected container: Container,
    protected serviceCreationCallback: (container: Container) => any) {
  }

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

class FactoryContainerService extends ContainerService {
  get(): any {
    return this.serviceCreationCallback(this.container)
  }
}

class ProtectedParameter {
  private initialised = false
  protected value: any

  constructor(
    protected container: Container,
    protected parameterCreationCallback: (container: Container) => any) {
  }

  get(): any {
    if (!this.initialised) {
      this.value = this.parameterCreationCallback(this.container)
      this.initialised = true
    }

    return this.value
  }
}

export class Container {
  [key: string]: any

  public registry = new Map<string, any>()

  register(
    service: string | Container,
    serviceCreationCallback?: ((container: Container) => any)
      | FactoryContainerService
      | ProtectedParameter
  ): Container {
    if (typeof service === 'string' && serviceCreationCallback) {
      if (serviceCreationCallback instanceof FactoryContainerService) {
        this.registry.set(service, serviceCreationCallback)
      } else if (serviceCreationCallback instanceof ProtectedParameter) {
        Object.assign(this, {
          get [(service as string)]() {
            return (serviceCreationCallback as any).get()
          }
        })
      } else {
        this.registry.set(service, new ContainerService(this, serviceCreationCallback))
      }
    } else if(service instanceof Container) {
      service.registry.forEach((value, key) => {
        this.register(key, value.raw())
      })
    }

    return this
  }

  factory(serviceCreationCallback: (container: Container) => any): FactoryContainerService {
    return new FactoryContainerService(this, serviceCreationCallback)
  }

  protect(parameterCreationCallback: (container: Container) => any): ProtectedParameter {
    return new ProtectedParameter(this, parameterCreationCallback)
  }

  get(service: string): any {
    if (this.registry.has(service)) {
      return this.registry.get(service).get()
    }
  }

  extend(service: string, extensionCallback: (storage: any, container: Container) => any): any {
    if (this.registry.has(service)) {
      const serviceMethod = this.get(service)
      extensionCallback(serviceMethod, this)
    }
  }

  raw(service: string): any {
    if (this.registry.has(service)) {
      return this.registry.get(service).raw()
    }
  }

  delete(service: string): void {
    if (this.registry.has(service)) {
      this.registry.delete(service)
    }
  }

  deleteAll(): void {
    this.registry.clear()
  }
}
