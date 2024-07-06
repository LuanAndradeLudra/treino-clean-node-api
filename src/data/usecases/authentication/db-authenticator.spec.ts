import { IAuthenticationModel } from '../../../domain/models/authentication'
import { IHashComparer } from '../../protocols/cryptography/comparer'
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { IAccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthenticator } from './db-authenticator'

interface ISutTypes {
  sut: DbAuthenticator
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository
  hashComparerStub: IHashComparer
}

const makeSut = (): ISutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashCompare()
  const sut = new DbAuthenticator(loadAccountByEmailRepositoryStub, hashComparerStub)
  return { sut, loadAccountByEmailRepositoryStub, hashComparerStub }
}

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    load(email: string): Promise<IAccountModel> {
      return Promise.resolve(makeFakeAccount())
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeHashCompare = (): IHashComparer => {
  class HashComparerStub implements IHashComparer {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }

  return new HashComparerStub()
}

const makeFakeAuthRequest = (): IAuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeAccount = (): IAccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

describe('DbAuthenticator UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthRequest())
    expect(loadSpy).toHaveBeenCalledWith(makeFakeAuthRequest().email)
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockImplementationOnce(() => Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAuthRequest())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
    const account = await sut.auth(makeFakeAuthRequest())
    expect(account).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthRequest())
    expect(compareSpy).toHaveBeenCalledWith(makeFakeAuthRequest().password, makeFakeAccount().password)
  })
})
