import { CompareFieldsValidator } from '../../../presentation/helpers/validator/compare-field-validator'
import { EmailValidation } from '../../../presentation/helpers/validator/email-validation/email-validation'
import { RequiredFieldValidator } from '../../../presentation/helpers/validator/required-field-validator'
import { IValidator } from '../../../presentation/helpers/validator/validator'
import { ValidatorComposity } from '../../../presentation/helpers/validator/validator-composity'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adaptor'

export const makeSignUpValidator = (): ValidatorComposity => {
  const validators: IValidator[] = []

  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validators.push(new RequiredFieldValidator(field))
  }

  validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))

  validators.push(new EmailValidation(new EmailValidatorAdapter(), 'email'))

  return new ValidatorComposity(validators)
}
