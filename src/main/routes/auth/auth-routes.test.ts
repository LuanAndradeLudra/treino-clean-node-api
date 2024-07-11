import request from 'supertest'
import app from '../../config/app'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

describe('Auth Routes', () => {
  let accountCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
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

  describe('POST /SignIn', () => {
    test('Should return 200 on signin', async () => {
      const hashedPassword = await hash('12345678', 12)
      await accountCollection.insertOne({
        name: 'Luan',
        email: 'luanandradeti10@gmail.com',
        password: hashedPassword
      })
      await request(app)
        .post('/api/signin')
        .send({
          email: 'luanandradeti10@gmail.com',
          password: '12345678'
        })
        .expect(200)
    })

    test('Should return 401 if signin fails', async () => {
      await request(app)
        .post('/api/signin')
        .send({
          email: 'luanandradeti10@gmail.com',
          password: '12345678'
        })
        .expect(401)
    })
  })
})
