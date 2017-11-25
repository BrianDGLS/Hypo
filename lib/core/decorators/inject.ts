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
