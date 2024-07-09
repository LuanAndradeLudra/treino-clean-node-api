import { IValidation } from '../../../presentation/protocols'

export class ValidationComposite implements IValidation {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly validators: IValidation[]
  ) {}

  validate(input: object): Error {
    for (const validator of this.validators) {
      const validatorError = validator.validate(input)
      if (validatorError) return validatorError
    }
  }
}
