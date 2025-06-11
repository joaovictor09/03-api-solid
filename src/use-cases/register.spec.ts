import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const userPassword = '123456'

    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: userPassword,
    })

    const isPasswordCorrectlyHashed = await compare(
      userPassword,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    const registerUser = async () =>
      await sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
      })

    await registerUser()

    await expect(registerUser).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
