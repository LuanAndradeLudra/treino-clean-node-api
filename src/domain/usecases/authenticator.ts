import { IAuthenticationModel } from '../models/authentication'

/* eslint-disable no-unused-vars */
export interface IAuthenticator {
  auth(authentication: IAuthenticationModel): Promise<string>
}
