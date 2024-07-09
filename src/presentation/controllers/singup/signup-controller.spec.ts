import { SignUpController } from './singup-controller'
import { DuplicatedEntry, MissingParamError } from '../../errors'
import {
  IAddAccount,
  IAddAccountModel,
  IAccountModel,
  IHttpRequest,
  IValidation,
  IAuthenticator,
  IAuthenticationModel
} from './signup-controller-protocols'
import { created, serverError, badRequest, forbidden } from '../../helpers/http/http-helper'

const makeFakeRequest = (exclude: string[] = []): IHttpRequest => {
  const httpRequest: IHttpRequest = {
    body: {}
  }
  if (!exclude.includes('name')) httpRequest.body['name'] = 'any_name'
  if (!exclude.includes('email')) httpRequest.body['email'] = 'any_email@mail.com'
  if (!exclude.includes('password')) httpRequest.body['password'] = 'any_password'
  if (!exclude.includes('passwordConfirmation')) httpRequest.body['passwordConfirmation'] = 'any_password'
  return httpRequest
}

const makeFakeAccount = (): IAccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeFakeAuthenticationAccount = (): IAuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeAuthenticator = (): IAuthenticator => {
  class AuthenticatorStub implements IAuthenticator {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    auth(authentication: IAuthenticationModel): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticatorStub()
}

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, require-await
    async add(account: IAddAccountModel): Promise<IAccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
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

interface ISutTypes {
  sut: SignUpController
  addAccountStub: IAddAccount
  validationStub: IValidation
  authenticatorStub: IAuthenticator
}

const makeSut = (): ISutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authenticatorStub = makeAuthenticator()
  const sut = new SignUpController(addAccountStub, validationStub, authenticatorStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticatorStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if Validator returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call Validator with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validatorSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validatorSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith(makeFakeRequest(['passwordConfirmation']).body)
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authenticator with correct values', async () => {
    const { sut, authenticatorStub } = makeSut()
    const authSpy = jest.spyOn(authenticatorStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith(makeFakeAuthenticationAccount())
  })

  test('Should return 500 if Authenticator throws', async () => {
    const { sut, authenticatorStub } = makeSut()
    jest.spyOn(authenticatorStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if AddACcount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new DuplicatedEntry('email')))
  })

  test('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(created({ accessToken: 'any_token' }))
  })
})
