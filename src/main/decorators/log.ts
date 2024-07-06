import { ILogErrorRepository } from '../../data/protocols/db/log-error-repository'
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements IController {
  private readonly controller: IController
  private readonly logErrorRepositoryStub: ILogErrorRepository

  constructor(controller: IController, logErrorRepositoryStub: ILogErrorRepository) {
    this.controller = controller
    this.logErrorRepositoryStub = logErrorRepositoryStub
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse: IHttpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      //log
      this.logErrorRepositoryStub.logError(httpResponse.body['stack'])
    }
    return httpResponse
  }
}
