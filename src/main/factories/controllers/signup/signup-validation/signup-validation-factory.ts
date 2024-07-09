import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../../validation'
import { IValidation } from '../../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../../../infra/validators/email-validator/email-validator-adaptor'

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
