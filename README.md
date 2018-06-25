# Hypo

A dependency injection container. Supports NodeJS and in browser development.

## Usage

To create a container create a new instance of the `Container` class.

```typescript
import { Container } from 'hypo'

const container = new Container()
```

A container has two types of dependencies. These are known as **services** and **parameters**.

## Defining a service

A service is an object that does something as part of a larger system. Examples of services: a database connection, a templating engine, or a mailer. Almost any global object can be a service.

Services are defined using a callback function that returns an instance of an object.

```typescript
const container = new Container()

container.register('owner', c => {
  return new Person('Brian', 26)
})

container.register('cat', c => {
  return new Cat('Garfield', 4, c.get('owner'))
})
```

Alternatively calls to the `register()` method can be chained, as demonstrated below.

```typescript
container
  .register('owner', c => new Person('Brian', 26))
  .register('cat', c => new Cat('Garfield', 4, c.get('owner')))
```

Note that the callback has access to the current container's instance, via it's first argument.
This allows you to reference other contained services and parameters when defining a new service.

Objects are created only when they are first accessed via the `get()` method, so order is not important.
Using a defined service is very easy as demonstrated below.

```typescript
const cat = container.get('cat')
```

The above is roughly equivalent to the following.

```typescript
const cat = new Cat('Garfield', 4, new Person('Brian', 26))
```

## Defining a factory service

By default the same instance of a service is returned when calling the container's `get()` method. If you want to return a new instance of the service you can make use of the container's `factory()` method as demonstrated below.

```typescript
container.register('uniqueRobot', container.factory(c => {
  return new Robot()
}))

const uniqueRobot = container.get('uniqueRobot')
``` 

## Defining parameters

Defining a parameter allows for easy configuration of your container from the outside and to store global values.

```typescript
container.myName = 'Brian'
container.myAge = 26

container.register('me', c => {
  return new Person(c.myName, c.myAge)
})
```

## Protecting parameters

To use an anonymous function to define a parameter use the `protect()` container method.

```typescript
container['prop'] = 42

container.register('protected_prop', container.protect(c => {
  return c.prop * 2
}))
```

## Update a registered service

In some cases you may want to modify a service definition after it has been defined. You can use the `extend()` method to define additional code to be run on your service just after it is created.

```typescript
container.register('cat', c => {
  return new Cat('Garfield', 4, c.get('owner'))
})

container.extend('cat', (storage, c) => {
  storage.details = () => `${storage.name} - ${storage.age}`
  return storage
})
```

The first argument is the name of the service to extend, the second a function that gets access to the object instance and the container.

## Extend a container

If you use the same libraries over and over, you might want to reuse some services from one project to the next one.
You can easily extend a container by registering it to another.

```typescript
const app = new Container()

app['name'] = 'My Awesome App'

const serviceContainer = new Container()

serviceContainer.register('magicNumberService', c => {
  return new MagicNumber()
})

app.register(serviceContainer)

app.get('magicNumberService')
```

## Get the service creation function

When accessing a service, the container automatically calls the function used to supply the service. This creates an instance of that service. If you want to get access to this function, use the `raw()` method.

```typescript
container.register('robot', c => new Robot())

// wraps previously defined robot method to create a factory method
container.register('uniqueRobot', container.factory(c => c.raw('robot')))
```

## Examples

Example projects:

- [Express Api](./examples/express-api)

## Thanks

Special thanks to the creators and maintainers of [Pimple](https://pimple.symfony.com/). 
Hypo attempts to follow the Pimple api for ease of use and familiarity. 
The Hypo docs also attempt to match that of the Pimple docs.

