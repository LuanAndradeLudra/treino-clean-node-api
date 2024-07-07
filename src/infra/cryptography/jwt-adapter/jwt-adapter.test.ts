import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'any_token'
  }
}))

const secret = 'secret'

interface ISutTypes {
  sut: JwtAdapter
}

const makeSut = (): ISutTypes => {
  const sut = new JwtAdapter(secret)
  return { sut }
}

describe('Jwt Adapter', () => {
  test('Should call JsonWebToken Sign with correct values', () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    sut.encrypt('field', 'any_value')
    expect(signSpy).toHaveBeenCalledWith({ field: 'any_value' }, secret)
  })

  test('Should return a token on JsonWebToken Sign success', () => {
    const { sut } = makeSut()
    const token = sut.encrypt('field', 'any_value')
    expect(token).toBe('any_token')
  })

  test('Should throw if JsonWebToken Sign throws', () => {
    const { sut } = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.encrypt).toThrow()
  })
})
