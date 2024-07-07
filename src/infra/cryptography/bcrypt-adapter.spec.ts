import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash'))
  },

  compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should throw if bcrypt hash throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      return new Promise((_, reject) => {
        reject(new Error())
      })
    })
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('Should return a valid hash on hash success', async () => {
    const sut = makeSut()
    const hashedValue = await sut.hash('any_value')
    expect(hashedValue).toBe('hash')
  })

  test('Should call bcrypt compare with correct values', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  test('Should return true when compare succeeds', async () => {
    const sut = makeSut()
    const compare = await sut.compare('any_value', 'any_hash')
    expect(compare).toBe(true)
  })

  test('Should return false when compare fails', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce((): Promise<boolean> => {
      return Promise.resolve(false)
    })
    const compare = await sut.compare('any_value', 'any_hash')
    expect(compare).toBe(false)
  })

  test('Should throw if bcrypt compare throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      return new Promise((_, reject) => {
        reject(new Error())
      })
    })
    const promise = sut.compare('any_value', 'any_hash')
    await expect(promise).rejects.toThrow()
  })
})
