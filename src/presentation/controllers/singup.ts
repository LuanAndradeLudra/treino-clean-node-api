import { MissingParamError } from '../errors/missing-param-error'
import { badRequest, serverError } from '../helpers/http-helper'
import { Controller, EmailValidator, httpRequest, httpResponse } from '../protocols'
import { InvalidParamError } from '../errors/invalid-param-error'

export class SignUpController implements Controller {
  private readonly validateEmail: EmailValidator

  constructor(validateEmail: EmailValidator) {
    this.validateEmail = validateEmail
  }

  handle(httpRequest: httpRequest): httpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (httpRequest.body['password'] !== httpRequest.body['passwordConfirmation']) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.validateEmail.isValid(httpRequest.body['email'])
      if (!isValid) return badRequest(new InvalidParamError('email'))
    } catch (_) {
      return serverError()
    }
  }
}
