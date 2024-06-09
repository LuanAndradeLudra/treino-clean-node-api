export class InvalidParamError extends Error {
  constructor(paramName: string) {
    super(`Invalid Param param: ${paramName}`)
    this.name = 'InvalidParamError'
  }
}
