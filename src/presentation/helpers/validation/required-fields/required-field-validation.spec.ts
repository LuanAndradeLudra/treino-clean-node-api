import { MissingParamError } from '../../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField Validation', () => {
  test('Should return MissinParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field')
    const errorValidation = sut.validate({ name: 'any_name' })
    expect(errorValidation).toEqual(new MissingParamError('field'))
  })
})
