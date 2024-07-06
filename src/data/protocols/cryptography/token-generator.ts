/* eslint-disable no-unused-vars */
export interface ITokenGenerator {
  generate(id: string): Promise<string>
}
