import { MissingParamError } from '../../../errors'
import { RequiredFieldValidation } from './required-field-validation'

interface ISutTypes {
  sut: RequiredFieldValidation
}

const makeSut = (): ISutTypes => {
  const sut = new RequiredFieldValidation('field')
  return {
    sut
  }
}

describe('RequiredField Validation', () => {
  test('Should return MissinParamError if validation fails', () => {
    const { sut } = makeSut()
    const errorValidation = sut.validate({ name: 'any_name' })
    expect(errorValidation).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const errorValidation = sut.validate({ field: 'any_field' })
    expect(errorValidation).toBeFalsy()
  })
})
