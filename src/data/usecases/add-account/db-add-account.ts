import {
  IAccountModel,
  IAddAccount,
  IAddAccountModel,
  Ihasher,
  IAddAccountRepository,
  ILoadAccountByEmailRepository
} from './db-add-account-protocols'

export class DbAddAccount implements IAddAccount {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly hasher: Ihasher,
    // eslint-disable-next-line no-unused-vars,
    private readonly addAccountRepository: IAddAccountRepository,
    // eslint-disable-next-line no-unused-vars
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
  ) {}

  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      const newAccount = await this.addAccountRepository.add(
        Object.assign({}, accountData, { password: hashedPassword })
      )
      return newAccount
    }

    return null
  }
}
