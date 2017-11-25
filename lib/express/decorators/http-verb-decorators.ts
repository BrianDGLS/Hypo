import {Controller} from "./controller";

const isController = (obj: any): boolean => obj instanceof Controller;

const validUrl = (url: string): boolean => typeof url === "string";

const executeDecorator = (fnName: string, url: string) => {
  return <T>(target: any, propertyKey: string | symbol, descriptor: any) => {
    const decoratorMethods: string[] = ["get", "put", "post", "delete"];
    const action = decoratorMethods.find((fn) => fnName.toLowerCase() === fn);

    if (!isController(target)) {
      throw new Error(`[@${fnName}]: target class must be instance of Controller.`);
    }

    if (!validUrl(url)) {
      throw new Error(`[@${fnName}(${url})]: supplied url must be of type string.`);
    }

    if (action) {
      target.getRouter()[action](url, descriptor.value.bind(target));
    } else {
      throw new Error(`[executeDecorator]: unknown function name: ${fnName}.`);
    }
  };
};

export const Get = (url: string): MethodDecorator =>
  <T>(target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
    executeDecorator("Get", url)(target, propertyKey, descriptor);
  };

export const Post = (url: string): MethodDecorator =>
  <T>(target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
    executeDecorator("Post", url)(target, propertyKey, descriptor);
  };

export const Put = (url: string): MethodDecorator =>
  <T>(target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
    executeDecorator("Put", url)(target, propertyKey, descriptor);
  };

export const Delete = (url: string): MethodDecorator =>
  <T>(target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
    executeDecorator("Delete", url)(target, propertyKey, descriptor);
  };
