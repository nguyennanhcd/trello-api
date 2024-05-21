/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB, GET_DB, CLOSE_DB } from './config/mongodb'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment'

const START_SERVER = () => {
  const app = express()


  app.get('/', async (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, async () => {
    // eslint-disable-next-line no-console
    console.log(`Hello, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

  // implement cleanup function before closing server
  exitHook(() => {
    // close mongodb connection
    CLOSE_DB()
    console.log('Exiting app')
  })

}

// server backend can only be connected when connect db successfully
( async () => {
  try {
    console.log('Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('Connected to MongoDB Cloud Atlas')
    START_SERVER()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
})()

// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDB Cloud Atlas'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.log(error)
//     process.exit(0)
//   })

