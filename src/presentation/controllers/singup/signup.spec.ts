import { SignUpController } from './singup'
import { MissingParamError } from '../../errors'
import { IAddAccount, IAddAccountModel, IAccountModel, IHttpRequest, IValidation } from './signup-protocols'
import { created, serverError, badRequest } from '../../helpers/http-helper'

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

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, require-await
    async add(account: IAddAccountModel): Promise<IAccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidator = (): IValidation => {
  class ValidatorStub implements IValidation {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    validate(input: object): Error {
      return null
    }
  }
  return new ValidatorStub()
}

interface ISutTypes {
  sut: SignUpController
  addAccountStub: IAddAccount
  validatorStub: IValidation
}

const makeSut = (): ISutTypes => {
  const addAccountStub = makeAddAccount()
  const validatorStub = makeValidator()
  const sut = new SignUpController(addAccountStub, validatorStub)
  return {
    sut,
    addAccountStub,
    validatorStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if Validator returns an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'validate')
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

  test('Should return 500 if addAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(created(makeFakeAccount()))
  })
})
