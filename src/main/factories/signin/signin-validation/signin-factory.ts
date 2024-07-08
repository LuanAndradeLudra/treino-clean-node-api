import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { makeSignInValidation } from './signin-validation-factory'
import { SignInController } from '../../../../presentation/controllers/singin/signin-controller'
import { IController } from '../../../../presentation/protocols'
import { DbAuthenticator } from '../../../../data/usecases/authentication/db-authenticator'
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log/log-mongo-repository'
import env from '../../../config/env'

export const makeSignInController = (): IController => {
  const salt = 12
  const hashCompare = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const loadAccountByEmailRepository = accountMongoRepository
  const updateAccessTokenRepository = accountMongoRepository
  const encrypter = new JwtAdapter(env.jwtSecret)

  const dbAuthenthicator = new DbAuthenticator(
    loadAccountByEmailRepository,
    hashCompare,
    encrypter,
    updateAccessTokenRepository
  )

  const validation = makeSignInValidation()

  const signInController = new SignInController(dbAuthenthicator, validation)

  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signInController, logMongoRepository)
}
