import { MissingParamError } from '../errors/missing-param-error'
import { ServerError } from '../errors/server-error'
import { httpResponse } from '../protocols/http'

export const badRequest = (error: MissingParamError): httpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): httpResponse => ({
  statusCode: 500,
  body: new ServerError()
})
