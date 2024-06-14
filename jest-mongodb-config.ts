export const mongodbMemoryServerOptions = {
  binary: {
    version: '7.0.11',
    skipMD5: true
  },
  autoStart: false,
  instance: {
    dbName: 'jest'
  }
}
