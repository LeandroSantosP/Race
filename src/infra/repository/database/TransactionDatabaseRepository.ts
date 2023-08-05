import { ITransactionRepository } from "@/application/repository/ITransactionRepository";
import { knex_connection } from "@/database/knex";
import { Transaction } from "@/domain/entity/Transaction";
import { Knex } from "knex";

export class TransactionDatabaseRepository implements ITransactionRepository {
    connection: Knex;
    constructor() {
        this.connection = knex_connection;
    }
    async save(transaction: Transaction): Promise<void> {
        await this.connection("transaction").insert({
            tid: transaction.tid,
            status: transaction.status,
            race_id: transaction.raceId,
            price: transaction.price,
            user_email: transaction.userEmail.value,
        });
    }
    async getByTid(tid: string): Promise<Transaction> {
        const [transactionData] = await this.connection("transaction").where({ tid });
        if (!transactionData) throw new Error("Transaction not found");

        return Transaction.create(
            transactionData.tid,
            transactionData.race_id,
            parseFloat(transactionData.price),
            transactionData.status,
            transactionData.user_email
        );
    }

    async close(): Promise<void> {
        await this.connection.destroy();
    }
}
