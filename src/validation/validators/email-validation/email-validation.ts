import { InvalidParamError } from '../../../presentation/errors'
import { IEmailValidator } from '../../protocols/email-validator'
import { IValidation } from '../../../presentation/protocols/validation'

export class EmailValidation implements IValidation {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly emailValidator: IEmailValidator,
    // eslint-disable-next-line no-unused-vars
    private readonly emailField: string
  ) {}

  validate(input: object): Error {
    const isValid = this.emailValidator.isValid(input[this.emailField])

    if (!isValid) {
      return new InvalidParamError(this.emailField)
    }
  }
}
