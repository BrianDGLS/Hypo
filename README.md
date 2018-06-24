# Hypo

A dependency injection container. Influenced by the [pimple](https://pimple.symfony.com/) dependency injection container.

## Usage

To create a container create a new instance of the `Container` class.

```typescript
import { Container } from 'hypo'

const container = new Container()
```

A Hypo container has two types of dependencies. These are known as `services` and `parameters`.

## Defining a service

```typescript
container.register('owner', container => {
  return new Person('Brian', 26)
})

container.register('cat', container => {
  return new Cat(container.get('owner'))
})
```

Alternatively the `register` method calls can be chained, as demonstrated below.

```typescript
container
  .register('owner', container => {
    return new Person('Brian', 26)
  })
  .register('cat', container => {
    return new Cat(container.get('owner'))
  })
```

## Defining a factory service

## Defining parameters

## Protecting parameters

## Update a registered service

## Extend a container

## Get the service creation function

When accessing a service, the Hypo container automatically calls the function used to supply the service. This creates an instance of that service. If you want to get raw access to this function, use the `raw` method.

```typescript
container.register('cat', container => {
  return new Cat(container.get('owner'))
})

const catFunction = container.raw('cat')
```

## Examples

Example projects:

- [Express Api](./examples/express-api)
