import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../protocols'
import { IEmailValidator } from '../singup/signup-protocols'

export class SignInController implements IController {
  private readonly emailValidator: IEmailValidator

  constructor(emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }

  // eslint-disable-next-line require-await
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

      return Promise.resolve(ok())
    } catch (error) {
      return serverError(error)
    }
  }
}
