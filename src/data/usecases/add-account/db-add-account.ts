import {
  IAccountModel,
  IAddAccount,
  IAddAccountModel,
  Ihasher,
  IAddAccountRepository
} from './db-add-account-protocols'

export class DbAddAccount implements IAddAccount {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly hasher: Ihasher,
    // eslint-disable-next-line no-unused-vars
    private readonly addAccountRepository: IAddAccountRepository
  ) {}

  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}
