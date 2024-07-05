import { InvalidParamError } from '../../errors'
import { IValidator } from './validator'

export class CompareFieldsValidator implements IValidator {
  private readonly fieldName: string
  private readonly fieldToCompareName: string

  constructor(fieldName: string, fieldToCompareName: string) {
    this.fieldName = fieldName
    this.fieldToCompareName = fieldToCompareName
  }

  validate(input: object): Error {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName)
    }
  }
}
