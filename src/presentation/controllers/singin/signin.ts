import { IAuthenticator, IController, IHttpRequest, IHttpResponse, IEmailValidator } from './signin-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'

export class SignInController implements IController {
  private readonly emailValidator: IEmailValidator
  private readonly authenticator: IAuthenticator

  constructor(emailValidator: IEmailValidator, authenticator: IAuthenticator) {
    this.emailValidator = emailValidator
    this.authenticator = authenticator
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body['email'])

      if (!isValid) return badRequest(new InvalidParamError('email'))

      const accessToken = await this.authenticator.auth(httpRequest.body['email'], httpRequest.body['password'])

      if (!accessToken) return unauthorized()

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
