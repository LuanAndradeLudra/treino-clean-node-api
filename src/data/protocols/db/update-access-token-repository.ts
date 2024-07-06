/* eslint-disable no-unused-vars */
export interface IUpdateAccessTokenRepository {
  update(id: string, token: string): Promise<void>
}
