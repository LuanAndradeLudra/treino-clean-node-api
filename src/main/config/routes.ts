/* eslint-disable @typescript-eslint/no-floating-promises */
import { Express, Router } from 'express'
import { readdirSync } from 'fs'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(`${__dirname}/../routes`).map((folder) => {
    readdirSync(`${__dirname}/../routes/${folder}`).map(async (file) => {
      if (!file.includes('.test.')) {
        (await import(`../routes/${folder}/${file}`)).default(router)
      }
    })
  })
}
