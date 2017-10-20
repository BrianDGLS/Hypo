import * as mocha from 'mocha'
import { expect } from 'chai'

import { Dependency, Injector, Container, Registry } from '../lib/hypo'

describe('Hypo', () => {
  let dependency: Dependency
  let dependencies: Dependency[]
  let container: Container
  let cls: any

  beforeEach(() => {
    dependencies = [
      {name: 'TEST1', value: 1},
      {name: 'TEST2', value: 2},
      {name: 'TEST3', value: 3},
      {name: 'TEST4', value: 4},
      {name: 'TEST5', value: 5},
    ]
    container = new Container()
    dependencies.map(d => container.register(d))
  })

  it('class should have injected dependency', () => {
    dependency = dependencies[0]

    @container.inject([dependency.name])
    class C {}

    cls = new C()
    expect(cls[dependency.name]).to.eq(dependency.value)
  })

  it('class should have all injected dependencies', () => {
    @container.inject(dependencies.map(({name}) => name))
    class C {}

    cls = new C()

    dependencies.map(({name, value}) => {
      expect(cls[name]).to.eq(value)
    })
  })
})

describe('Hypo.Container', () => {
  let dependency: Dependency
  let dependencies: Dependency[]
  let container: Container

  beforeEach(() => {
    dependencies = [
      {name: 'TEST1', value: 1},
      {name: 'TEST2', value: 2},
      {name: 'TEST3', value: 3},
      {name: 'TEST4', value: 4},
      {name: 'TEST5', value: 5},
    ]
    container = new Container()
  })

  describe('#register', () => {
    it('should add dependency to internal registry', () => {
      dependency = dependencies[0]
      expect(container.register(dependency).get(dependency.name)).to.deep.eq(dependency)
    })

    it('should be a chainable function', () => {
      container
        .register(dependencies[0])
        .register(dependencies[1])
        .register(dependencies[2])
        .register(dependencies[3])

      expect(container.get(dependencies[0].name)).to.deep.eq(dependencies[0])
      expect(container.get(dependencies[1].name)).to.deep.eq(dependencies[1])
      expect(container.get(dependencies[2].name)).to.deep.eq(dependencies[2])
      expect(container.get(dependencies[3].name)).to.deep.eq(dependencies[3])
    })
  })
})

describe('Hypo.Injector', () => {
})

describe('Hypo.Registry', () => {
  let subject: Registry
  let dependency: Dependency

  describe('#get', () => {
    beforeEach(() => {
      subject = new Registry()
      dependency = {name: 'foo', value: 'bar'}
      subject.add(dependency)
    })

    it('should throw error if dependency does not exist in registry', () => {
      expect(() => subject.get('test')).to.throw()
    })

    it('should return dependency with given name', () => {
      expect(subject.get(dependency.name)).to.deep.eq(dependency)
    })
  })

  describe('#add', () => {
    beforeEach(() => {
      subject = new Registry()
      dependency = {name: 'foo', value: 'bar'}
    })

    it('should add a new dependency to the registry', () => {
      subject.add(dependency)
      expect(subject.get(dependency.name)).to.deep.eq(dependency)
    })

    it('should throw error if dependency already in registry', () => {
      subject.add(dependency)
      expect(() => subject.add(dependency)).to.throw()
    })
  })

  describe('#remove', () => {
    beforeEach(() => {
      subject = new Registry()
      dependency = {name: 'foo', value: 'bar'}
      subject.add(dependency)
    })

    it('should remove an existing dependency from the registry', () => {
      subject.remove(dependency.name)
      expect(() => subject.get(dependency.name)).to.throw()
    })

    it('should throw error if dependency is not in registry', () => {
      expect(() => subject.remove('foobar')).to.throw()
    })
  })

  describe('#all', () => {
    beforeEach(() => {
      subject = new Registry()
    })

    it('should return all dependencies in the registry', () => {
      const len = 10
      let i = len
      while (i--) {
        subject.add({name: 'foo' + i, value: 'bar'})
      }
      expect(subject.all().length).to.eq(len)
    })
  })

  describe('#clear', () => {
    beforeEach(() => {
      subject = new Registry()
      dependency = {name: 'foo', value: 'bar'}
      subject.add(dependency)
    })

    it('should remove all dependencies from the registry', () => {
      subject.clear()
      expect(subject.all().length).to.eq(0)
    })
  })
})
