import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { IHttpRequest } from '../../protocols'
import { SignInController } from './signin'

interface ISutTypes {
  sut: SignInController
}

const makeSut = (): ISutTypes => {
  const sut = new SignInController()
  return { sut }
}

describe('SignIn Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const fakeRequest: IHttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const fakeRequest: IHttpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
