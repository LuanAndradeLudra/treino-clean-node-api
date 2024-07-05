import { IValidator } from './validator'

export class ValidatorComposity implements IValidator {
  private readonly validators: IValidator[]

  constructor(validators: IValidator[]) {
    this.validators = validators
  }

  validate(input: object): Error {
    for (const validator of this.validators) {
      const validatorError = validator.validate(input)
      if (validatorError) return validatorError
    }
  }
}
