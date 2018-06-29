export declare class ContainerService {
    protected container: Container;
    protected serviceCreationCallback: (container: Container) => any;
    private serviceInstance;
    constructor(container: Container, serviceCreationCallback: (container: Container) => any);
    get(): any;
    raw(): (container: Container) => any;
}
export declare class FactoryContainerService extends ContainerService {
    get(): any;
}
export declare class ProtectedParameter extends ContainerService {
    protected container: Container;
    protected serviceCreationCallback: (container: Container) => any;
    private value;
    constructor(container: Container, serviceCreationCallback: (container: Container) => any);
    get(): any;
}
export declare class Container {
    [key: string]: any;
    registry: Map<string, any>;
    register(service: string | Container, serviceCreationCallback?: ((container: Container) => any) | FactoryContainerService | ProtectedParameter): Container;
    factory(serviceCreationCallback: (container: Container) => any): FactoryContainerService;
    protect(parameterCreationCallback: (container: Container) => any): ProtectedParameter;
    get(service: string): any;
    extend(service: string, extensionCallback: (storage: any, container: Container) => any): any;
    raw(service: string): any;
    delete(service: string): void;
    deleteAll(): void;
    private throwIfServiceAlreadyRegistered(service);
    private throwIfParameterAlreadyRegistered(parameter);
    private throwIfServiceCreationCallbackNotSupplied(callback);
    private throwIfNotInRegistry(service);
    private throwIfInvalidServiceType();
}
