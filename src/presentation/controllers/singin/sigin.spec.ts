import { IAuthenticator } from '../../../domain/usecases/authenticator'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { IHttpRequest } from '../../protocols'
import { IEmailValidator } from '../singup/signup-protocols'
import { SignInController } from './signin'

interface ISutTypes {
  sut: SignInController
  emailValidatorStub: IEmailValidator
  autenticatorStub: IAuthenticator
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

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): ISutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const autenticatorStub = makeAuthenticator()
  const sut = new SignInController(emailValidatorStub, autenticatorStub)
  return { sut, emailValidatorStub, autenticatorStub }
}

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

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

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should call Authenticator with correct values', async () => {
    const { sut, autenticatorStub } = makeSut()
    const authSpy = jest.spyOn(autenticatorStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, autenticatorStub } = makeSut()
    jest.spyOn(autenticatorStub, 'auth').mockImplementationOnce(() => Promise.resolve(null))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })
})
