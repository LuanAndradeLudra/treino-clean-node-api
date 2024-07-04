import { MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../protocols'
import { IEmailValidator } from '../singup/signup-protocols'

export class SignInController implements IController {
  private readonly emailValidator: IEmailValidator

  constructor(emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }

  // eslint-disable-next-line require-await
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    this.emailValidator.isValid(httpRequest.body['email'])

    return Promise.resolve(ok())
  }
}
