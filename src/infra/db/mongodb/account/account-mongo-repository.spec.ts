import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'
import { IAddAccountModel } from '../../../../domain/models/add-account'

describe('Account Mongo Repository', () => {
  let accountCollection: Collection

  const fakeAccountRequest: IAddAccountModel = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add(fakeAccountRequest)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne(fakeAccountRequest)
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return null if loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })

  test('Should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut()
    const result = await accountCollection.insertOne(fakeAccountRequest)
    let account = await accountCollection.findOne({ _id: result.insertedId })
    expect(account.accessToken).toBeFalsy()
    await sut.updateAccessToken(account._id.toString(), 'any_token')
    account = await accountCollection.findOne({ _id: result.insertedId })
    expect(account.accessToken).toBeTruthy()
    expect(account.accessToken).toBe('any_token')
  })
})
