import {
  IAuthenticationModel,
  IAuthenticator,
  IHashComparer,
  ITokenGenerator,
  ILoadAccountByEmailRepository,
  IUpdateAccessTokenRepository
} from './db-authenticator-protocols'

export class DbAuthenticator implements IAuthenticator {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
  private readonly hashCompare: IHashComparer
  private readonly tokenGenerator: ITokenGenerator
  private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository

  constructor(
    loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    hashCompare: IHashComparer,
    tokenGenerator: ITokenGenerator,
    updateAccessTokenRepository: IUpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth(authentication: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (!account) return null

    const compare = await this.hashCompare.compare(authentication.password, account.password)
    if (!compare) return null

    const accessToken = await this.tokenGenerator.generate(account.id)

    await this.updateAccessTokenRepository.update(account.id, accessToken)

    return accessToken
  }
}
