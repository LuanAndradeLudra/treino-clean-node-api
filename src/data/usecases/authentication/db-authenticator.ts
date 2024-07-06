import { IAuthenticationModel } from '../../../domain/models/authentication'
import { IAuthenticator } from '../../../domain/usecases/authenticator'
import { ILoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'

export class DbAuthenticator implements IAuthenticator {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository

  constructor(loadAccountByEmailRepository: ILoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth(authentication: IAuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email)
    return Promise.resolve(null)
  }
}
