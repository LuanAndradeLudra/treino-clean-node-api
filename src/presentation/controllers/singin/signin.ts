import { IAuthenticator, IController, IHttpRequest, IHttpResponse, IValidation } from './signin-protocols'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { IAuthenticationModel } from '../../../domain/models/authentication'

export class SignInController implements IController {
  private readonly authenticator: IAuthenticator
  private readonly validation: IValidation

  constructor(authenticator: IAuthenticator, validation: IValidation) {
    this.authenticator = authenticator
    this.validation = validation
  }

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
