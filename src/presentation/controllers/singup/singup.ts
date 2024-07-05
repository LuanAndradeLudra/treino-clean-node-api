import { badRequest, created, serverError } from '../../helpers/http-helper'
import { IController, IHttpRequest, IHttpResponse, IAddAccount, IValidator } from './signup-protocols'

export class SignUpController implements IController {
  private readonly addAccount: IAddAccount
  private readonly validator: IValidator

  constructor(addAccount: IAddAccount, validator: IValidator) {
    this.addAccount = addAccount
    this.validator = validator
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validatorError = this.validator.validate(httpRequest.body)
      if (validatorError) return badRequest(validatorError)

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
