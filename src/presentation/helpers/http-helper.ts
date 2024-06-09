import { MissingParamError, ServerError } from '../errors'
import { httpResponse } from '../protocols/http'

export const badRequest = (error: MissingParamError): httpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): httpResponse => ({
  statusCode: 500,
  body: new ServerError()
})
