import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Luan',
        email: 'luanandradeti10@gmail.com',
        password: '12345678',
        passwordConfirmation: '12345678'
      })
      .expect(200)
  })
})
