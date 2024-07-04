import { MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class SignInController implements Controller {
  // eslint-disable-next-line require-await
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return Promise.resolve(ok())
  }
}
