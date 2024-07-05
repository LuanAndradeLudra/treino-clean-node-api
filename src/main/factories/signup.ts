import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../presentation/controllers/singup/singup'
import { IController } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { makeSignUpValidator } from './signup-validation/signup-validator'

export const makeSignUpController = (): IController => {
  const salt = 12
  const bryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bryptAdapter, accountMongoRepository)
  const validator = makeSignUpValidator()
  const signUpController = new SignUpController(dbAddAccount, validator)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
