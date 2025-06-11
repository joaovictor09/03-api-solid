import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from 'generated/prisma/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Javascript gym',
      description: '',
      phone: '',
      latitute: new Decimal(-28.6752373),
      longitude: new Decimal(-49.3556954),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -28.6752373,
      userLongitude: -49.3556954,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const createCheckIn = () =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -28.6752373,
        userLongitude: -49.3556954,
      })

    await createCheckIn()

    await expect(createCheckIn).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to check in twice but in different day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -28.6752373,
      userLongitude: -49.3556954,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLongitude: -49.3556954,
      userLatitude: -28.6752373,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    // -28.6839736,-49.3192289

    gymsRepository.items.push({
      id: 'gym-02',
      title: 'TypeScript gym',
      description: '',
      phone: '',
      latitute: new Decimal(-28.6839736),
      longitude: new Decimal(-49.3192289),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -28.6752373,
        userLongitude: -49.3556954,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
