import { ILogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements IController {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly controller: IController,
    // eslint-disable-next-line no-unused-vars
    private readonly logErrorRepositoryStub: ILogErrorRepository
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse: IHttpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      //log
      await this.logErrorRepositoryStub.logError(httpResponse.body['stack'])
    }
    return httpResponse
  }
}
