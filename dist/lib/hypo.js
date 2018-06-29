"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ContainerService {
    constructor(container, serviceCreationCallback) {
        this.container = container;
        this.serviceCreationCallback = serviceCreationCallback;
    }
    get() {
        if (this.serviceInstance) {
            return this.serviceInstance;
        }
        this.serviceInstance = this.serviceCreationCallback(this.container);
        return this.serviceInstance;
    }
    raw() {
        return this.serviceCreationCallback;
    }
}
exports.ContainerService = ContainerService;
class FactoryContainerService extends ContainerService {
    get() {
        return this.serviceCreationCallback(this.container);
    }
}
exports.FactoryContainerService = FactoryContainerService;
class ProtectedParameter extends ContainerService {
    constructor(container, serviceCreationCallback) {
        super(container, serviceCreationCallback);
        this.container = container;
        this.serviceCreationCallback = serviceCreationCallback;
        this.value = this.serviceCreationCallback(this.container);
    }
    get() {
        return this.value;
    }
}
exports.ProtectedParameter = ProtectedParameter;
class Container {
    constructor() {
        this.registry = new Map();
    }
    register(service, serviceCreationCallback) {
        if (service && typeof service === 'string') {
            this.throwIfServiceAlreadyRegistered(service);
            this.throwIfServiceCreationCallbackNotSupplied(serviceCreationCallback);
            if (serviceCreationCallback instanceof FactoryContainerService) {
                this.registry.set(service, serviceCreationCallback);
            }
            else if (serviceCreationCallback instanceof ProtectedParameter) {
                this.throwIfParameterAlreadyRegistered(service);
                Object.assign(this, {
                    get [service]() {
                        return serviceCreationCallback.get();
                    }
                });
            }
            else {
                this.registry.set(service, new ContainerService(this, serviceCreationCallback));
            }
        }
        else if (service instanceof Container) {
            service.registry.forEach((value, key) => {
                this.register(key, value.raw());
            });
        }
        else {
            this.throwIfInvalidServiceType();
        }
        return this;
    }
    factory(serviceCreationCallback) {
        return new FactoryContainerService(this, serviceCreationCallback);
    }
    protect(parameterCreationCallback) {
        return new ProtectedParameter(this, parameterCreationCallback);
    }
    get(service) {
        this.throwIfNotInRegistry(service);
        return this.registry.get(service).get();
    }
    extend(service, extensionCallback) {
        this.throwIfNotInRegistry(service);
        const serviceMethod = this.get(service);
        extensionCallback(serviceMethod, this);
    }
    raw(service) {
        this.throwIfNotInRegistry(service);
        return this.registry.get(service).raw();
    }
    delete(service) {
        if (this.registry.has(service)) {
            this.registry.delete(service);
        }
    }
    deleteAll() {
        this.registry.clear();
    }
    throwIfServiceAlreadyRegistered(service) {
        if (this.registry.has(service)) {
            throw new Error(`${service} has already been registered, user unique service name`);
        }
    }
    throwIfParameterAlreadyRegistered(parameter) {
        if (this.hasOwnProperty(parameter)) {
            throw new Error(`${parameter} has already been registered, user unique parameter name`);
        }
    }
    throwIfServiceCreationCallbackNotSupplied(callback) {
        if (!callback) {
            throw new Error(`callback must be supplied when registering a service or protected parameter`);
        }
    }
    throwIfNotInRegistry(service) {
        if (!this.registry.has(service)) {
            throw new Error(`${service} not in registry`);
        }
    }
    throwIfInvalidServiceType() {
        throw new Error(`service must be of type string or Container`);
    }
}
exports.Container = Container;
//# sourceMappingURL=hypo.js.map