import { IAccountModel } from '../models/account'
import { IAddAccountModel } from '../models/add-account'

export interface IAddAccount {
  // eslint-disable-next-line no-unused-vars
  add(account: IAddAccountModel): Promise<IAccountModel>
}
