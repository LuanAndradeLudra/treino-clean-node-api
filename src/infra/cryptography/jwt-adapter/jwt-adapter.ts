import { IEncrypter } from '../../../data/protocols/cryptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements IEncrypter {
  private readonly secret: string

  constructor(secret: string) {
    this.secret = secret
  }

  encrypt(field: string, value: string): Promise<string> {
    const token = jwt.sign({ [field]: value }, this.secret)
    return Promise.resolve(token)
  }
}
