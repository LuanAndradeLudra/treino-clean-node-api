import request from 'supertest'
import app from '../../config/app'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'

describe('Auth Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /SignUp', () => {
    test('Should return 201 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Luan',
          email: 'luanandradeti10@gmail.com',
          password: '12345678',
          passwordConfirmation: '12345678'
        })
        .expect(201)
    })
  })
})
