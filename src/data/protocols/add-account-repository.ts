import { AddAccountModel } from '../usecases/add-account/db-add-account-protocols'
import { AccountModel } from '../../domain/models/account'

export interface AddAccountRepository {
  // eslint-disable-next-line no-unused-vars
  add(accountData: AddAccountModel): Promise<AccountModel>
}
