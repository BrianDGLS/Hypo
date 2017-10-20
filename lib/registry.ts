import { Dependency } from './dependency'

export class Registry {
  private _registry = new Map<string, any>()

  public all (): Dependency[] {
    return Array.from(this._registry.keys()).map(this.get.bind(this))
  }

  public get (name: string): Dependency {
    const value = this._registry.get(name)
    if (value) {
      return {name, value}
    }

    throw new Error(`[Registry#get]: [name:${name}] does not exist in registry.`)
  }

  public add ({name, value}: Dependency): void {
    if (this._registry.get(name)) {
      throw new Error(`[Registry#add]: [name:${name}] exists in registry.`)
    }

    this._registry.set(name, value)
  }

  public remove (name: string): void {
    if (this._registry.get(name) === undefined) {
      throw new Error(`[Registry#remove]: [name:${name}] does not exist in registry.`)
    }

    this._registry.delete(name)
  }

  public clear (): void {
    this._registry.clear()
  }
}
