import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    // eslint-disable-next-line no-console
    console.log(`Database connected at: ${env.mongoUrl}`)
    const app = (await import('./config/app')).default

    // eslint-disable-next-line no-console
    app.listen(env.port, () => console.log('Server running at http://localhost:3000'))
  })
  // eslint-disable-next-line no-console
  .catch(console.error)
