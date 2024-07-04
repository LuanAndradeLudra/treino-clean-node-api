/* eslint-disable no-unused-vars */
export interface IAuthenticator {
  auth(email: string, password: string): Promise<string>
}
