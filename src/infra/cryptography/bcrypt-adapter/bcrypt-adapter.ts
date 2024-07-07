import bcrypt from 'bcrypt'
import { IHashComparer } from '../../../data/protocols/cryptography/comparer'
import { Ihasher } from '../../../data/protocols/cryptography/hasher'

export class BcryptAdapter implements Ihasher, IHashComparer {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }
  async hash(value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt)
    return hashedValue
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const compare = await bcrypt.compare(value, hash)
    return compare
  }
}
