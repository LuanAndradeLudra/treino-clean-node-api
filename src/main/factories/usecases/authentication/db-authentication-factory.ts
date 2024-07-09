import { DbAuthenticator } from '../../../../data/usecases/authentication/db-authenticator'
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import env from '../../../config/env'
import { IAuthenticator } from '../../../../domain/usecases/authenticator'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'

export const makeDbAuthenticator = (): IAuthenticator => {
  const salt = 12
  const hashCompare = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const loadAccountByEmailRepository = accountMongoRepository
  const updateAccessTokenRepository = accountMongoRepository
  const encrypter = new JwtAdapter(env.jwtSecret)

  return new DbAuthenticator(loadAccountByEmailRepository, hashCompare, encrypter, updateAccessTokenRepository)
}
