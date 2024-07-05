import { MissingParamError } from '../../../errors'
import { IValidation } from '../validation'
import { ValidationComposity } from './validation-composity'

interface ISutTypes {
  sut: ValidationComposity
  validationStub: IValidation
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
  const validationStub = makeValidation()
  const sut = new ValidationComposity([validationStub])
  return {
    sut,
    validationStub
  }
}

describe('Validation Composity', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_field' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
