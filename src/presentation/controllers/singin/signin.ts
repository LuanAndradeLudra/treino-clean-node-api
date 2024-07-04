import { IAuthenticator } from '../../../domain/usecases/authenticator'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../protocols'
import { IEmailValidator } from '../singup/signup-protocols'

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

      await this.authenticator.auth(httpRequest.body['email'], httpRequest.body['password'])

      return Promise.resolve(ok())
    } catch (error) {
      return serverError(error)
    }
  }
}
