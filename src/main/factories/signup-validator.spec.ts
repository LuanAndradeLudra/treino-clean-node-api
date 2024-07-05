import { CompareFieldsValidator } from '../../presentation/helpers/validator/compare-field-validator'
import { RequiredFieldValidator } from '../../presentation/helpers/validator/required-field-validator'
import { IValidator } from '../../presentation/helpers/validator/validator'
import { ValidatorComposity } from '../../presentation/helpers/validator/validator-composity'
import { makeSignUpValidator } from './signup-validator'

jest.mock('../../presentation/helpers/validator/validator-composity')

beforeAll(() => {
  getRequiredFields()
  getCompareFields()
})

const validators: IValidator[] = []

const getCompareFields = (): void => {
  validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
}

const getRequiredFields = (): void => {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validators.push(new RequiredFieldValidator(field))
  }
}

describe('SignUpValidator Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    makeSignUpValidator()

    expect(ValidatorComposity).toHaveBeenCalledWith(validators)
  })
})
