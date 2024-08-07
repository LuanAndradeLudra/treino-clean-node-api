import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../../validation'
import { IValidation } from '../../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../../../infra/validators/email-validator/email-validator-adaptor'

export const makeSignInValidation = (): ValidationComposite => {
  const validations: IValidation[] = []

  const requiredFields = ['email', 'password']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation(new EmailValidatorAdapter(), 'email'))

  return new ValidationComposite(validations)
}
