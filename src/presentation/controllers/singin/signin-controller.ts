import {
  IAuthenticator,
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation,
  IAuthenticationModel
} from './signin-controller-protocols'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'

export class SignInController implements IController {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly authenticator: IAuthenticator,
    // eslint-disable-next-line no-unused-vars
    private readonly validation: IValidation
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) return badRequest(validationError)

      const authencationData: IAuthenticationModel = {
        email: httpRequest.body['email'],
        password: httpRequest.body['password']
      }

      const accessToken = await this.authenticator.auth(authencationData)

      if (!accessToken) return unauthorized()

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
