import { EmailValidation, ValidationComposite, RequiredFieldValidation } from '../../../../../validation'
import { IValidation } from '../../../../../presentation/protocols/validation'
import { IEmailValidator } from '../../../../../validation/protocols/email-validator'
import { makeSignInValidation } from './signin-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite/validation-composite')

beforeAll(() => {
  getRequiredFields()
  getEmailValidatorFields()
})

const validations: IValidation[] = []

const getEmailValidatorFields = (): void => {
  validations.push(new EmailValidation(makeEmailValidation(), 'email'))
}

const getRequiredFields = (): void => {
  const requiredFields = ['email', 'password']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
}

const makeEmailValidation = (): IEmailValidator => {
  class EmailValidattorStub implements IEmailValidator {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidattorStub()
}

describe('SignIn Validation Factory', () => {
  test('Should call ValidationComposite with all validator', () => {
    makeSignInValidation()
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
