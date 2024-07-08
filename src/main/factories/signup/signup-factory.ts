import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { SignUpController } from '../../../presentation/controllers/singup/singup-controller'
import { IController } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignUpValidation } from './signup-validation/signup-validation-factory'

export const makeSignUpController = (): IController => {
  const salt = 12
  const bryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bryptAdapter, accountMongoRepository)
  const validator = makeSignUpValidation()
  const signUpController = new SignUpController(dbAddAccount, validator)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
