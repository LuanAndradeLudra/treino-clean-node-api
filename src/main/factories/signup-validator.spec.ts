import { RequiredFieldValidator } from '../../presentation/helpers/validator/required-field-validator'
import { IValidator } from '../../presentation/helpers/validator/validator'
import { ValidatorComposity } from '../../presentation/helpers/validator/validator-composity'
import { makeSignUpValidator } from './signup-validator'

jest.mock('../../presentation/helpers/validator/validator-composity')

const validators: IValidator[] = []

const getRequiredFields = (): void => {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validators.push(new RequiredFieldValidator(field))
  }
}

const getValidators = (): IValidator[] => {
  getRequiredFields()
  return validators
}

describe('SignUpValidator Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    makeSignUpValidator()
    const validators = getValidators()

    expect(ValidatorComposity).toHaveBeenCalledWith(validators)
  })
})
