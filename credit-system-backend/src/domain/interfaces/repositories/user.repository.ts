import { User } from 'src/domain/entities/user.entity';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}

export const USER_REPOSITORY = 'USER_REPOSITORY';
