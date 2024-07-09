import { SignInController } from '../../../../presentation/controllers/singin/signin-controller'
import { IController } from '../../../../presentation/protocols'
import { makeSignInValidation } from './signin-validation/signin-validation-factory'
import { makeDbAuthenticator } from '../../usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSignInController = (): IController => {
  const signInController = new SignInController(makeDbAuthenticator(), makeSignInValidation())
  return makeLogControllerDecorator(signInController)
}
