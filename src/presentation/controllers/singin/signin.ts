import { MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../protocols'

export class SignInController implements IController {
  // eslint-disable-next-line require-await
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const requiredFields = ['email']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return Promise.resolve(ok())
  }
}
