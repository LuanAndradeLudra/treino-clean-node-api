import { MissingParamError } from '../../../errors'
import { IValidation } from '../validation'
import { ValidationComposity } from './validation-composity'

interface ISutTypes {
  sut: ValidationComposity
  validationStubs: IValidation[]
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    validate(input: object): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): ISutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposity(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('Validation Composity', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_field' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more than one validation fail', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_field' })
    expect(error).toEqual(new Error())
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_field' })
    expect(error).toBeFalsy()
  })
})
