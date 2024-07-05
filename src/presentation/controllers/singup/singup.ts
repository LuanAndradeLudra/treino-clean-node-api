import { badRequest, created, serverError } from '../../helpers/http-helper'
import { IController, IHttpRequest, IHttpResponse, IAddAccount, IValidation } from './signup-protocols'

export class SignUpController implements IController {
  private readonly addAccount: IAddAccount
  private readonly validation: IValidation

  constructor(addAccount: IAddAccount, validation: IValidation) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) return badRequest(validationError)

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
