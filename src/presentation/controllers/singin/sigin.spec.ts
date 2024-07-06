import { IAuthenticator, IHttpRequest, IValidation } from './signin-protocols'
import { InvalidParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { SignInController } from './signin'

interface ISutTypes {
  sut: SignInController
  autenticatorStub: IAuthenticator
  validationStub: IValidation
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    validate(input: object): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAuthenticator = (): IAuthenticator => {
  class AuthenticatorStub implements IAuthenticator {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    auth(email: string, password: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticatorStub()
}

const makeSut = (): ISutTypes => {
  const autenticatorStub = makeAuthenticator()
  const validationStub = makeValidation()
  const sut = new SignInController(autenticatorStub, validationStub)
  return { sut, autenticatorStub, validationStub }
}

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

describe('SignIn Controller', () => {
  test('Should return 400 if Validation returns an errro', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new InvalidParamError('field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('field')))
  })

  test('Should call Authenticator with correct values', async () => {
    const { sut, autenticatorStub } = makeSut()
    const authSpy = jest.spyOn(autenticatorStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password')
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 500 if Authenticator throws', async () => {
    const { sut, autenticatorStub } = makeSut()
    jest.spyOn(autenticatorStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, autenticatorStub } = makeSut()
    jest.spyOn(autenticatorStub, 'auth').mockImplementationOnce(() => Promise.resolve(null))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})
