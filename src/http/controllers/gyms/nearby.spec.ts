import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Near Gym',
        description: null,
        phone: null,
        latitude: -28.6752373,
        longitude: -49.3556954,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Far gym',
        description: null,
        phone: null,
        latitude: -28.3594619,
        longitude: -49.289311,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -28.6752373,
        longitude: -49.3556954,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' }),
    ])
  })
})
