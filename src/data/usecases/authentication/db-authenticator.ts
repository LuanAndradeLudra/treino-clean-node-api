import { IAuthenticationModel } from '../../../domain/models/authentication'
import { IAuthenticator } from '../../../domain/usecases/authenticator'
import { IHashComparer } from '../../protocols/cryptography/comparer'
import { ITokenGenerator } from '../../protocols/cryptography/token-generator'
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthenticator implements IAuthenticator {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
  private readonly hashCompare: IHashComparer
  private readonly tokenGenerator: ITokenGenerator

  constructor(
    loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    hashCompare: IHashComparer,
    tokenGenerator: ITokenGenerator
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.tokenGenerator = tokenGenerator
  }

  async auth(authentication: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (!account) return null

    const compare = await this.hashCompare.compare(authentication.password, account.password)
    if (!compare) return null

    await this.tokenGenerator.generate(account.id)

    return ''
  }
}
