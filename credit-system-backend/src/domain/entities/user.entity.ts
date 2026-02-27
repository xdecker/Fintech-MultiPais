import { Role } from './enums/user-role.enum';
import { isEmail } from 'class-validator';

export class User {
  constructor(
    private readonly _id: string,
    private readonly _email: string,
    private readonly _role: Role,
    private readonly _countries: string[],
  ) {
    this.validateEmail(_email);
  }

  get id() {
    return this._id;
  }

  get code() {
    return this._email;
  }

  get name() {
    return this._role;
  }

  get countries() {
    return this._countries;
  }

  private validateEmail(email: string) {
    if (!isEmail(email)) {
      throw new Error('Invalid email.');
    }
  }
}
