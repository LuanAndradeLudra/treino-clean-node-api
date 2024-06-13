import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', () => {
    class EncrypterStub implements Encrypter {
      encrypt(value: string): Promise<string> {
        if (value) return new Promise((resolve) => resolve('hashed_value'))
      }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData['password'])
  })
})
