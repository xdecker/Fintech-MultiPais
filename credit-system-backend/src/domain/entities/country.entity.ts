export class Country {
  constructor(
    private readonly _id: string,
    private readonly _code: string,
    private readonly _name: string,
  ) {}

  get id() {
    return this._id;
  }

  get code() {
    return this._code;
  }

  get name() {
    return this._name;
  }
}
