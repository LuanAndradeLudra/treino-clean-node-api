import {
  IAuthenticationModel,
  IAuthenticator,
  IHashComparer,
  IEncrypter,
  ILoadAccountByEmailRepository,
  IUpdateAccessTokenRepository
} from './db-authenticator-protocols'

export class DbAuthenticator implements IAuthenticator {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    // eslint-disable-next-line no-unused-vars
    private readonly hashCompare: IHashComparer,
    // eslint-disable-next-line no-unused-vars
    private readonly encrypter: IEncrypter,
    // eslint-disable-next-line no-unused-vars
    private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository
  ) {}

  async auth(authentication: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (!account) return null

    const compare = await this.hashCompare.compare(authentication.password, account.password)
    if (!compare) return null

    const accessToken = this.encrypter.encrypt('id', account.id)

    await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)

    return accessToken
  }
}
