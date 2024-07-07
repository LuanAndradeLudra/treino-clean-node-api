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
  test('Should call JsonWebToken Sign with correct values', async () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('field', 'any_value')
    expect(signSpy).toHaveBeenCalledWith({ field: 'any_value' }, secret)
  })

  test('Should return a token on JsonWebToken Sign success', async () => {
    const { sut } = makeSut()
    const token = await sut.encrypt('field', 'any_value')
    expect(token).toBe('any_token')
  })
})
