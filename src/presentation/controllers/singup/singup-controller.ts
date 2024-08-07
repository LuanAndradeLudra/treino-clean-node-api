import { DuplicatedEntry } from '../../errors'
import { badRequest, created, forbidden, serverError } from '../../helpers/http/http-helper'
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IAddAccount,
  IValidation,
  IAuthenticator
} from './signup-controller-protocols'

export class SignUpController implements IController {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly addAccount: IAddAccount,
    // eslint-disable-next-line no-unused-vars
    private readonly validation: IValidation,
    // eslint-disable-next-line no-unused-vars
    private readonly authenticator: IAuthenticator
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) return badRequest(validationError)

      const account = await this.addAccount.add({
        name: httpRequest.body!['name'],
        email: httpRequest.body!['email'],
        password: httpRequest.body!['password']
      })

      if (!account) return forbidden(new DuplicatedEntry('email'))

      const accessToken = await this.authenticator.auth({
        email: httpRequest.body!['email'],
        password: httpRequest.body!['password']
      })

      return created({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
