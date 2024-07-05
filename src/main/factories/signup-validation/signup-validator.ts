import { CompareFieldsValidation } from '../../../presentation/helpers/validation/compare-fields/compare-field-validation'
import { EmailValidation } from '../../../presentation/helpers/validation/email-validation/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validation/required-fields/required-field-validation'
import { IValidation } from '../../../presentation/helpers/validation/validation'
import { ValidationComposity } from '../../../presentation/helpers/validation/validation-composity'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adaptor'

export const makeSignUpValidation = (): ValidationComposity => {
  const validators: IValidation[] = []

  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validators.push(new RequiredFieldValidation(field))
  }

  validators.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

  validators.push(new EmailValidation(new EmailValidatorAdapter(), 'email'))

  return new ValidationComposity(validators)
}
