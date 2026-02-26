import { User } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/domain/interfaces/repositories/user.repository';

export class GetUserbyEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
