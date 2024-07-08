import { IEncrypter } from '../../../data/protocols/cryptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements IEncrypter {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly secret: string
  ) {}

  encrypt(field: string, value: string): string {
    const token = jwt.sign({ [field]: value }, this.secret)
    return token
  }
}
