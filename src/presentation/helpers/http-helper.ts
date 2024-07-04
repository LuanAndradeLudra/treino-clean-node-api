import { ServerError } from '../errors'
import { IHttpResponse } from '../protocols'

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (error: Error): IHttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})

export const created = (data: object): IHttpResponse => ({
  statusCode: 201,
  body: data
})

export const ok = (data: object = { ok: 'ok' }): IHttpResponse => ({
  statusCode: 200,
  body: data
})
