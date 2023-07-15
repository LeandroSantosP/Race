import { Email } from "./Passenger";

export class Transaction {
    private constructor(
        readonly tid: string,
        readonly status: string,
        readonly raceId: string,
        readonly price: number,
        readonly userEmail: Email
    ) {}

    static create(tid: string, raceId: string, price: number, status: string, email: string): Transaction {
        return new Transaction(tid, status, raceId, price, new Email(email));
    }
}
