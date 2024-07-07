import {
  IAccountModel,
  IAddAccount,
  IAddAccountModel,
  Ihasher,
  IAddAccountRepository
} from './db-add-account-protocols'

export class DbAddAccount implements IAddAccount {
  private readonly hasher: Ihasher
  private readonly addAccountRepository: IAddAccountRepository
  constructor(hasher: Ihasher, addAccountRepository: IAddAccountRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
  }

  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}
