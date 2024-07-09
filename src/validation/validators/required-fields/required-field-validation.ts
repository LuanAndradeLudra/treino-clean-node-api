import { IValidation } from '../../../presentation/protocols/validation'
import { MissingParamError } from '../../../presentation/errors'

export class RequiredFieldValidation implements IValidation {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly field: string
  ) {}

  validate(input: object): Error {
    if (!input[this.field]) return new MissingParamError(this.field)
  }
}
