export class DuplicatedEntry extends Error {
  constructor(paramName: string) {
    super(`Duplicated entry for: ${paramName}`)
    this.name = 'DuplicatedEntry'
  }
}
