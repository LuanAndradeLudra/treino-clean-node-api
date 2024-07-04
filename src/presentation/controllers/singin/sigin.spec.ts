import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols'
import { SignInController } from './signin'

interface SutTypes {
  sut: SignInController
}

const makeSut = (): SutTypes => {
  const sut = new SignInController()
  return { sut }
}

describe('SignIn Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const fakeRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
