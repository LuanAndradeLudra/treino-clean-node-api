import { MissingParamError } from '../errors/missing-param-error'
import { httpResponse } from '../protocols/http'

export const badRequest = (error: MissingParamError): httpResponse => ({
  statusCode: 400,
  body: error
})
