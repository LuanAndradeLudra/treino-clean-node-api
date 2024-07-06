import { MissingParamError } from '../../../errors'
import { IValidation } from '../../../protocols/validation'

export class RequiredFieldValidation implements IValidation {
  private readonly field: string

  constructor(field: string) {
    this.field = field
  }

  validate(input: object): Error {
    if (!input[this.field]) return new MissingParamError(this.field)
  }
}
