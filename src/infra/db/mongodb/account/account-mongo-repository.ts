/* eslint-disable indent */
import { ObjectId } from 'mongodb'
import { IAddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { ILoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { IUpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'
import { IAccountModel } from '../../../../domain/models/account'
import { IAddAccountModel } from '../../../../domain/models/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository
  implements IAddAccountRepository, ILoadAccountByEmailRepository, IUpdateAccessTokenRepository
{
  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = await accountCollection.findOne({ _id: result.insertedId })
    return MongoHelper.map(account) as IAccountModel
  }

  async loadByEmail(email: string): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && (MongoHelper.map(account) as IAccountModel)
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          accessToken: token
        }
      }
    )
  }
}
