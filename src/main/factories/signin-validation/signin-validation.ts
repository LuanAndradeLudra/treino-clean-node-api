import { EmailValidation } from '../../../presentation/helpers/validation/email-validation/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validation/required-fields/required-field-validation'
import { ValidationComposite } from '../../../presentation/helpers/validation/validation-composite/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adaptor'

export const makeSignInValidation = (): ValidationComposite => {
  const validations = []

  const requiredFields = ['email', 'password']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation(new EmailValidatorAdapter(), 'email'))

  return new ValidationComposite(validations)
}
