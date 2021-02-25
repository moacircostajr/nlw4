import request from 'supertest'
import app from '../app'

import createConnection from '../database'

describe('Users', () => {

  beforeAll(async () => {
    const connection = await createConnection()
    await connection.runMigrations()
  })

  it('Should be able to create a new user', async () => {
    const response = await request(app).post('/users').send(
      {
        name: 'User 3 example',
        email: 'user3@example.com'
      }
    )
    expect(response.status).toBe(201)
  })

  it('Should NOT be able to create a new user if email account already exists', async () => {
    const response = await request(app).post('/users').send(
      {
        name: 'User 3 example',
        email: 'user3@example.com'
      }
    )
    expect(response.status).toBe(400)
  })

})
