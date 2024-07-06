import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../presentation/helpers/validation'
import { EmailValidatorAdapter } from '../../../../utils/email-validator-adaptor'

export const makeSignInValidation = (): ValidationComposite => {
  const validations = []

  const requiredFields = ['email', 'password']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation(new EmailValidatorAdapter(), 'email'))

  return new ValidationComposite(validations)
}
