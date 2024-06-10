import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { Controller, EmailValidator, httpRequest, httpResponse, AddAccount } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly validateEmail: EmailValidator
  private readonly addAccount: AddAccount

  constructor(validateEmail: EmailValidator, addAccount: AddAccount) {
    this.validateEmail = validateEmail
    this.addAccount = addAccount
  }

  handle(httpRequest: httpRequest): httpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body![field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (httpRequest.body!['password'] !== httpRequest.body!['passwordConfirmation']) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.validateEmail.isValid(httpRequest.body!['email'])

      if (!isValid) return badRequest(new InvalidParamError('email'))

      const account = this.addAccount.add({
        name: httpRequest.body!['name'],
        email: httpRequest.body!['email'],
        password: httpRequest.body!['password']
      })

      return {
        statusCode: 201,
        body: account
      }
    } catch (_) {
      return serverError()
    }
  }
}
