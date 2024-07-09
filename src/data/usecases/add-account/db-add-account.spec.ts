import {
  IAccountModel,
  IAddAccountModel,
  Ihasher,
  IAddAccountRepository,
  ILoadAccountByEmailRepository
} from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeFakeAccount = (): IAccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_value'
})

const makeFakeAccountData = (): IAddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeHasher = (): Ihasher => {
  class HasherStub implements Ihasher {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_value'))
    }
  }
  return new HasherStub()
}

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    add(accountData: IAddAccountModel): Promise<IAccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    loadByEmail(email: string): Promise<IAccountModel> {
      return Promise.resolve(null)
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

interface ISutTypes {
  sut: DbAddAccount
  hasherStub: Ihasher
  addAccountRepositoryStub: IAddAccountRepository
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository
}

const makeSut = (): ISutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeFakeAccountData())
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_value'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(makeFakeAccountData())
    expect(loadSpy).toHaveBeenCalledWith(makeFakeAccountData().email)
  })

  test('Should return null if loadAccountByEmailRepository not returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(makeFakeAccount()))
    const account = await sut.add(makeFakeAccountData())
    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
