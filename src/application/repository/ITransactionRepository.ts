import { Transaction } from "@/domain/entity/Transaction";

export interface ITransactionRepository {
    save(transaction: Transaction): Promise<void>;
    getByTid(tid: string): Promise<Transaction>;
}
