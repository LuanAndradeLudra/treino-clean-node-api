import { InvalidParamError } from '../../../presentation/errors'
import { CompareFieldsValidation } from './compare-field-validation'

interface ISutTypes {
  sut: CompareFieldsValidation
}

const makeSut = (): ISutTypes => {
  const sut = new CompareFieldsValidation('field', 'fieldToCompare')
  return { sut }
}

describe('CompareField Validation', () => {
  test('Should return InvalidParamError if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({
      field: 'any_field',
      fieldToCompare: 'wrong_field'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({
      field: 'any_field',
      fieldToCompare: 'any_field'
    })
    expect(error).toBeFalsy()
  })
})
