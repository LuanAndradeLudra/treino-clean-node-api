import { CompareFieldsValidator } from '../../../presentation/helpers/validator/compare-field-validator'
import { EmailValidation } from '../../../presentation/helpers/validator/email-validation/email-validation'
import { RequiredFieldValidator } from '../../../presentation/helpers/validator/required-field-validator'
import { IValidator } from '../../../presentation/helpers/validator/validator'
import { ValidatorComposity } from '../../../presentation/helpers/validator/validator-composity'
import { IEmailValidator } from '../../../presentation/protocols/email-validator'
import { makeSignUpValidator } from './signup-validator'

jest.mock('../../../presentation/helpers/validator/validator-composity')

beforeAll(() => {
  getRequiredFields()
  getCompareFields()
  getEmailValidatorFields()
})

const validators: IValidator[] = []

const getEmailValidatorFields = (): void => {
  validators.push(new EmailValidation(makeEmailValidator(), 'email'))
}

const getCompareFields = (): void => {
  validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
}

const getRequiredFields = (): void => {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validators.push(new RequiredFieldValidator(field))
  }
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpValidator Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    makeSignUpValidator()

    expect(ValidatorComposity).toHaveBeenCalledWith(validators)
  })
})
