import { IAccountModel } from '../../../../domain/models/account'
import { IAddAccountModel } from '../../../../domain/models/add-account'

export interface IAddAccountRepository {
  // eslint-disable-next-line no-unused-vars
  add(accountData: IAddAccountModel): Promise<IAccountModel>
}
