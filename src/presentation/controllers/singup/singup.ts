import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, created, serverError } from '../../helpers/http-helper'
import { IController, IEmailValidator, IHttpRequest, IHttpResponse, IAddAccount, IValidator } from './signup-protocols'

export class SignUpController implements IController {
  private readonly validateEmail: IEmailValidator
  private readonly addAccount: IAddAccount
  private readonly validator: IValidator

  constructor(validateEmail: IEmailValidator, addAccount: IAddAccount, validator: IValidator) {
    this.validateEmail = validateEmail
    this.addAccount = addAccount
    this.validator = validator
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validatorError = this.validator.validate(httpRequest.body)
      if (validatorError) return badRequest(validatorError)
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

      const account = await this.addAccount.add({
        name: httpRequest.body!['name'],
        email: httpRequest.body!['email'],
        password: httpRequest.body!['password']
      })

      return created(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
