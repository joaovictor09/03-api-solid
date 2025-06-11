import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckInUseCase } from '../validate-check-in'

export function makeValidateCheckInUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()

  const validateCheckInUseCase = new ValidateCheckInUseCase(
    prismaCheckInsRepository,
  )

  return validateCheckInUseCase
}
