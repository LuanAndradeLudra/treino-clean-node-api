import { httpRequest, httpResponse } from './http'

export interface Controller {
  // eslint-disable-next-line no-unused-vars
  handle(httpRequest: httpRequest): httpResponse
}
