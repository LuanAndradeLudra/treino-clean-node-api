import { Ihasher } from '../../data/protocols/cryptography/hasher'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Ihasher {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }
  async hash(value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt)
    return hashedValue
  }
}
