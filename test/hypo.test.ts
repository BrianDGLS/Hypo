import { expect } from 'chai'

import { Container } from '../lib'

class Greeter {
  constructor(public name: string) {}
  greet() {
    return `Hello, ${this.name}!`
  }
}

class Counter {
  constructor(public count: number) {}
}

let testSubject: Container

beforeEach(() => {
  testSubject = new Container()
})

describe('Container', () => {
  it('should not throw error when creating new container instance', () => {
    expect(() => new Container()).not.to.throw()
  })

  it('should correctly return an instance of Container', () => {
    expect(new Container()).to.be.instanceOf(Container)
  })

  describe('#register()', () => {
    const registerGreeter = () =>
      testSubject.register('greeter', c => new Greeter('World'))

    it('should correctly register a service', () => {
      registerGreeter()
      expect(testSubject.get('greeter').greet()).to.eq('Hello, World!')
    })

    it('should correctly register a container', () => {
      const container = new Container()
      container.register('greeter', c => new Greeter('World'))

      testSubject.register(container)
      expect(testSubject.get('greeter').greet()).to.eq('Hello, World!')
    })

    it('should return same instance of service by default', () => {
      let count = 0
      testSubject.register('count', c => new Counter(count++))

      expect(testSubject.get('count').count).to.eq(0)
      expect(testSubject.get('count').count).to.eq(0)
      expect(testSubject.get('count').count).to.eq(0)
    })

    it('should throw an error when service name already exists', () => {
      registerGreeter()
      expect(registerGreeter).to.throw()
    })

    it('should throw an error when service method is not supplied', () => {
      expect(() => testSubject.register('throw')).to.throw()
    })

    it('should be a chainable function', () => {
      testSubject
        .register('firstGreeter', c => new Greeter('1'))
        .register('secondGreeter', c => new Greeter('2'))

      expect(testSubject.get('firstGreeter').name).to.eq('1')
      expect(testSubject.get('secondGreeter').name).to.eq('2')
    })

    it('should throw if invalid service type given', () => {
      expect(() => testSubject.register(3 as any, c => {})).to.throw()
      expect(() => testSubject.register({} as any, c => {})).to.throw()
      expect(() => testSubject.register([] as any, c => {})).to.throw()
      expect(() => testSubject.register('' as any, c => {})).to.throw()
    })
  })

  describe('#get()', () => {
    it('should throw error if service is not registered', () => {
      expect(() => testSubject.get('unknown')).to.throw()
    })

    it('should throw when trying to access param', () => {
      testSubject.param = 3
      expect(() => testSubject.get('param')).to.throw()
    })
  })

  describe('#protect()', () => {
    const myNumber = 9876543210
    const registerParameter = () =>
      testSubject.register('myNumber', testSubject.protect(c => myNumber))

    it('should correctly register a parameter', () => {
      registerParameter()
      testSubject.myNumber = myNumber
    })

    it('should throw if parameter already defined', () => {
      registerParameter()
      expect(() => registerParameter()).to.throw()
    })

    it('should allow deletion', () => {
      registerParameter()
      delete testSubject.myNumber
      expect(testSubject.myNumber).to.be.undefined;
    })

    it('should register parameter from function result', () => {
      testSubject.register(
        'testParam',
        testSubject.protect(c => {
          const three = () => 3
          return three()
        })
      )

      expect(testSubject.testParam).to.eq(3)
    })

  })

  describe('#factory()', () => {
    it('should return new instance when service is called', () => {
      let count = 0
      testSubject.register(
        'count',
        testSubject.factory(c => new Counter(count++))
      )

      expect(testSubject.get('count').count).to.eq(0)
      expect(testSubject.get('count').count).to.eq(1)
      expect(testSubject.get('count').count).to.eq(2)
    })
  })

  describe('#extend()', () => {
    it('should throw if service doesnt exists', () => {
      expect(() => testSubject.extend('unknown', (storage, c) => {})).to.throw()
    })

    it('should modify existing service', () => {
      testSubject.register('greeter', c => new Greeter('World'))

      testSubject.extend('greeter', (storage, c) => {
        storage.name = 'Updated'
      })

      expect(testSubject.get('greeter').greet()).to.eq('Hello, Updated!')
    })
  })

  describe('#raw()', () => {
    it('should return correct service creation method', () => {
      const creationMethod = (c: Container) => new Greeter('World')
      testSubject.register('greeter', creationMethod)

      expect(testSubject.raw('greeter').toString()).to.eq(
        creationMethod.toString()
      )
    })

    it('should throw if service not registered', () => {
      expect(() => testSubject.raw('unknown')).to.throw()
    })
  })

  describe('#delete()', () => {
    it('should delete correct service', () => {
      testSubject.register('greeter', c => new Greeter('World'))
      testSubject.delete('greeter')

      expect(testSubject.registry.has('greeter')).to.eq(false)
    })

    it('should not throw if service not registered', () => {
      expect(() => testSubject.delete('unknown')).not.to.throw()
    })
  })

  describe('#deleteAll()', () => {
    it('should delete all registered services', () => {
      testSubject.register('greeter', c => new Greeter('World'))
      testSubject.register('count', c => new Counter(1))

      testSubject.deleteAll()

      expect(testSubject.registry.size).to.eq(0)
    })
  })
})
