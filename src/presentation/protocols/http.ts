export interface httpRequest {
  body?: object
}

export interface httpResponse {
  statusCode: number
  body?: Error
}
