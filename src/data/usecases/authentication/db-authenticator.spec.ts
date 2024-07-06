import {
  IAuthenticationModel,
  IHashComparer,
  ITokenGenerator,
  ILoadAccountByEmailRepository,
  IUpdateAccessTokenRepository,
  IAccountModel
} from './db-authenticator-protocols'
import { DbAuthenticator } from './db-authenticator'

interface ISutTypes {
  sut: DbAuthenticator
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository
  hashComparerStub: IHashComparer
  tokenGeneratorStub: ITokenGenerator
  updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository
}

const makeSut = (): ISutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashCompare()
  const tokenGeneratorStub = makeTokenGenerator()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthenticator(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  }
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

const makeTokenGenerator = (): ITokenGenerator => {
  class TokenGeneratorStub implements ITokenGenerator {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    generate(id: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }

  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepository = (): IUpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements IUpdateAccessTokenRepository {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    update(id: string, token: string): Promise<void> {
      return Promise.resolve()
    }
  }

  return new UpdateAccessTokenRepositoryStub()
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

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(() => Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAuthRequest())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const account = await sut.auth(makeFakeAuthRequest())
    expect(account).toBeNull()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthRequest())
    expect(generateSpy).toHaveBeenCalledWith(makeFakeAccount().id)
  })

  test('Should throws if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockImplementationOnce(() => Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAuthRequest())
    await expect(promise).rejects.toThrow()
  })

  test('Should return a token on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthRequest())
    expect(accessToken).toBe('any_token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeAuthRequest())
    expect(updateSpy).toHaveBeenCalledWith(makeFakeAccount().id, 'any_token')
  })

  test('Should throws if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockImplementationOnce(() => Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAuthRequest())
    await expect(promise).rejects.toThrow()
  })
})
