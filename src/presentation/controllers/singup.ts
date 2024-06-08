export class SignUpController {
  handle(httpRequest: object): object {
    if (httpRequest)
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
  }
}
