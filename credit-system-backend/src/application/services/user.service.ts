import { Inject, Injectable } from '@nestjs/common';
import { GetUserbyEmailUseCase } from '../use-cases/user/get-user-by-email.use-case';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/domain/interfaces/user.repository';

@Injectable()
export class UserService {
  private readonly getUserByEmailUseCase: GetUserbyEmailUseCase;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async getUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}
