/* eslint-disable no-unused-vars */
export interface IEncrypter {
  encrypt(value: string): Promise<string>
}
