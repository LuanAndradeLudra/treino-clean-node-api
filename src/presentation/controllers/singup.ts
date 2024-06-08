export class SignUpController {
  handle(httpRequest: object): object {
    if (!httpRequest['name']) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }
    if (!httpRequest['email']) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email')
      }
    }
  }
}
