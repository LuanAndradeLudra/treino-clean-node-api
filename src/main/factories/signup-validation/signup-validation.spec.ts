import { CompareFieldsValidation } from '../../../presentation/helpers/validation/compare-fields/compare-field-validation'
import { EmailValidation } from '../../../presentation/helpers/validation/email-validation/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validation/required-fields/required-field-validation'
import { IValidation } from '../../../presentation/helpers/validation/validation'
import { ValidationComposite } from '../../../presentation/helpers/validation/validation-composite/validation-composite'
import { IEmailValidator } from '../../../presentation/protocols/email-validator'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../../presentation/helpers/validation/validation-composite/validation-composite')

beforeAll(() => {
  getRequiredFields()
  getCompareFields()
  getEmailValidatorFields()
})

const validators: IValidation[] = []

const getEmailValidatorFields = (): void => {
  validators.push(new EmailValidation(makeEmailValidator(), 'email'))
}

const getCompareFields = (): void => {
  validators.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
}

const getRequiredFields = (): void => {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validators.push(new RequiredFieldValidation(field))
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

describe('SignUp Validation Factory', () => {
  test('Should call ValidationComposite with all validators', () => {
    makeSignUpValidation()

    expect(ValidationComposite).toHaveBeenCalledWith(validators)
  })
})
