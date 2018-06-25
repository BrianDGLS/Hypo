import * as express from 'express'

import { Container } from '../../../lib/hypo'


class Person {
  constructor(public name: string, public age: number) {
  }
}

class Cat {
  constructor(public name: string, public age: number, public owner: Person) {
  }
}

const container = new Container()

container.register('owner', c => {
  return new Person('Brian', 26)
})

container.register('cat', c => {
  return new Cat('Garfield', 4, c.get('owner'))
})

container.extend('cat', (storage, c) => {
  storage.details = () => `${storage.name} - ${storage.age}`
})

console.log(container.get('cat').details())

let count = 0

class Counter {
  count = count++
}

container.register('static', c => {
  return new Counter()
})

container.register('factory', container.factory(container.raw('static')))


setInterval(() => {
  console.log('static -> ' + container.get('static').count)
  console.log('factory -> ' + container.get('factory').count)
}, 1000)

container['prop'] = 42

container.register('protected_prop', container.protect(c => {
  return c.prop * 2
}))

console.log(container.prop)
console.log(container.protected_prop)

class MagicNumber {
  value = 3
}

const app = new Container()

app['name'] = 'My Awesome App'

const serviceContainer = new Container()

serviceContainer.register('magicNumberService', c => {
  return new MagicNumber()
})

app.register(serviceContainer)

// returns magicNumberService registered in the serviceContainer
app.get('magicNumberService')

console.log(app.get('magicNumberService').value)

