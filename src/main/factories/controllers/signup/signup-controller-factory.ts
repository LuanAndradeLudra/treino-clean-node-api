import { SignUpController } from '../../../../presentation/controllers/singup/singup-controller'
import { IController } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account-factory'
import { makeDbAuthenticator } from '../../usecases/authentication/db-authentication-factory'
import { makeSignUpValidation } from './signup-validation/signup-validation-factory'

export const makeSignUpController = (): IController => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthenticator())
  return makeLogControllerDecorator(signUpController)
}
