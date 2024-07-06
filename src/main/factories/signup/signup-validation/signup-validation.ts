import { CompareFieldsValidation } from '../../../../presentation/helpers/validation/compare-fields/compare-field-validation'
import { EmailValidation } from '../../../../presentation/helpers/validation/email-validation/email-validation'
import { RequiredFieldValidation } from '../../../../presentation/helpers/validation/required-fields/required-field-validation'
import { IValidation } from '../../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../../presentation/helpers/validation/validation-composite/validation-composite'
import { EmailValidatorAdapter } from '../../../../utils/email-validator-adaptor'

export const makeSignUpValidation = (): ValidationComposite => {
  const validation: IValidation[] = []

  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validation.push(new RequiredFieldValidation(field))
  }

  validation.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

  validation.push(new EmailValidation(new EmailValidatorAdapter(), 'email'))

  return new ValidationComposite(validation)
}
