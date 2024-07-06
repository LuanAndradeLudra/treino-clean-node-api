/* eslint-disable no-unused-vars */
export interface IHashComparer {
  compare(value: string, hash: string): Promise<boolean>
}
