import { IHttpRequest, IHttpResponse } from './http'

export interface IController {
  // eslint-disable-next-line no-unused-vars
  handle(httpRequest: IHttpRequest): Promise<IHttpResponse>
}
