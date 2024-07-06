import { ILogErrorRepository } from '../../data/protocols/db/log-error-repository'
import { IAccountModel } from '../../domain/models/account'
import { created, serverError } from '../../presentation/helpers/http/http-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    logError(stack: string): Promise<void> {
      return new Promise((resolve) => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

const makeController = (): IController => {
  class ControllerStub implements IController {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      return new Promise((resolve) => resolve(created(makeFakeAccount())))
    }
  }
  return new ControllerStub()
}

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

const makeFakeServerError = (): IHttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

interface ISutTypes {
  sut: LogControllerDecorator
  controllerStub: IController
  logErrorRepositoryStub: ILogErrorRepository
}

const makeSut = (): ISutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest: IHttpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest: IHttpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(created(makeFakeAccount()))
  })

  test('Should call logErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise((resolve) => resolve(makeFakeServerError())))
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
