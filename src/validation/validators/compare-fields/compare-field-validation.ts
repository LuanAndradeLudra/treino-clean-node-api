import { InvalidParamError } from '../../../presentation/errors'
import { IValidation } from '../../../presentation/protocols/validation'

export class CompareFieldsValidation implements IValidation {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly fieldName: string,
    // eslint-disable-next-line no-unused-vars
    private readonly fieldToCompareName: string
  ) {}

  validate(input: object): Error {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName)
    }
  }
}
