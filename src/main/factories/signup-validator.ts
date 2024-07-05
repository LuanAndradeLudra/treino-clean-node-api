import { CompareFieldsValidator } from '../../presentation/helpers/validator/compare-field-validator'
import { RequiredFieldValidator } from '../../presentation/helpers/validator/required-field-validator'
import { IValidator } from '../../presentation/helpers/validator/validator'
import { ValidatorComposity } from '../../presentation/helpers/validator/validator-composity'

export const makeSignUpValidator = (): ValidatorComposity => {
  const validators: IValidator[] = []

  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validators.push(new RequiredFieldValidator(field))
  }

  validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))

  return new ValidatorComposity(validators)
}
