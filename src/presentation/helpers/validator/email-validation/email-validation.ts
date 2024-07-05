import { InvalidParamError } from '../../../errors'
import { IEmailValidator } from '../../../protocols/email-validator'
import { IValidator } from '../validator'

export class EmailValidation implements IValidator {
  private readonly emailValidator: IEmailValidator
  private readonly emailField: string

  constructor(emailValidator: IEmailValidator, emailField: string) {
    this.emailValidator = emailValidator
    this.emailField = emailField
  }

  validate(input: object): Error {
    const isValid = this.emailValidator.isValid(input[this.emailField])

    if (!isValid) {
      return new InvalidParamError(this.emailField)
    }
  }
}
