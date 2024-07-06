import { IValidation } from '../validation'

export class ValidationComposite implements IValidation {
  private readonly validators: IValidation[]

  constructor(validators: IValidation[]) {
    this.validators = validators
  }

  validate(input: object): Error {
    for (const validator of this.validators) {
      const validatorError = validator.validate(input)
      if (validatorError) return validatorError
    }
  }
}
