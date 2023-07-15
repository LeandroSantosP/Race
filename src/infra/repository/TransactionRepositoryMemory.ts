import { ITransactionRepository } from "@/application/repository/ITransactionRepository";
import { Transaction } from "@/domain/entity/Transaction";

export class TransactionRepositoryMemory implements ITransactionRepository {
    transactions: Transaction[] = [];
    async save(transaction: Transaction): Promise<void> {
        this.transactions.push(transaction);
    }
    async getByTid(tid: string): Promise<Transaction> {
        const transaction = this.transactions.find((transaction) => transaction.tid === tid);
        if (!transaction) {
            throw new Error("Transaction not found");
        }
        return transaction;
    }
}
