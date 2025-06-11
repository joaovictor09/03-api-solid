import type { User, Prisma } from 'generated/prisma'
import type { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: data.created_at ?? new Date(),
      id: data.id ?? randomUUID(),
    } as User

    this.items.push(user)

    return user
  }
}
