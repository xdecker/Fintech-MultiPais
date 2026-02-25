import { CreditRequestStatus } from './credit-request-status.enum';
import { isEmail } from 'class-validator';

export class CreditRequest {
  private _status: CreditRequestStatus;

  constructor(
    private readonly _id: string,
    private readonly _amount: number,
    private readonly _currency: string,
    private readonly _applicantName: string,
    private readonly _applicantEmail: string,
    private readonly _document: string,
    private readonly _countryId: string,
    private readonly _createdById: string,
    status?: CreditRequestStatus,
  ) {
    this.validateAmount(_amount);
    this.validateEmail(_applicantEmail);

    this._status = status ?? CreditRequestStatus.PENDING;
  }

  get id() {
    return this._id;
  }

  get amount() {
    return this._amount;
  }

  get currency() {
    return this._currency;
  }

  get applicantName() {
    return this._applicantName;
  }

  get applicantEmail() {
    return this._applicantEmail;
  }

  get document() {
    return this._document;
  }

  get countryId() {
    return this._countryId;
  }

  get createdById() {
    return this._createdById;
  }

  get status() {
    return this._status;
  }

  submitForReview() {
    if (this._status !== CreditRequestStatus.PENDING) {
      throw new Error('Only pending requests can move to review.');
    }

    this._status = CreditRequestStatus.UNDER_REVIEW;
  }

  approve() {
    if (this._status !== CreditRequestStatus.UNDER_REVIEW) {
      throw new Error('Only requests under review can be approved.');
    }

    this._status = CreditRequestStatus.APPROVED;
  }

  reject() {
    if (this._status !== CreditRequestStatus.UNDER_REVIEW) {
      throw new Error('Only requests under review can be rejected.');
    }

    this._status = CreditRequestStatus.REJECTED;
  }

  private validateAmount(amount: number) {
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero.');
    }
  }

  private validateEmail(email: string) {
    if (!isEmail(email)) {
      throw new Error('Invalid email.');
    }
  }
}
