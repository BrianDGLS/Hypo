import * as express from 'express'

import { Container } from '../../../lib/hypo'

let instances = 0

class ExampleClass {
  instance = instances++
}

const container = new Container()

container.register('ExampleClass', (container: Container) => new ExampleClass())
container.register(
  'ExampleFactory',
  container.factory((container: Container) => {
    return new ExampleClass()
  })
)


let count = 0
const interval = setInterval(() => {
  console.log(`Example Class -> ${container.get('ExampleClass').instance}`)
  console.log(`Example Factory -> ${container.get('ExampleFactory').instance}`)
  count++
  if (count === 10) clearInterval(interval)
}, 1000)

container.register(
  '404Handler',
  (container: Container) => (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    next({ status: 404, message: 'page not found' })
  }
)

container.register(
  'ErrorHandler',
  (container: Container) => (
    err: any,
    req: express.Request,
    res: express.Response
  ) => {
    res.locals.error = err
    res.locals.message = err.message
    res.status(err.status || 500)
    res.send(err)
  }
)

const app = express()

app.use(container.get('404Handler'))
app.use(container.get('ErrorHandler'))

console.log(container.raw('ErrorHandler').toString())
