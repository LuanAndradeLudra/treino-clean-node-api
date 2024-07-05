import { MissingParamError } from '../../errors'
import { IValidator } from './validator'

export class RequiredFieldValidator implements IValidator {
  private readonly field: string

  constructor(field: string) {
    this.field = field
  }

  validate(input: object): Error {
    if (!input[this.field]) return new MissingParamError(this.field)
  }
}
