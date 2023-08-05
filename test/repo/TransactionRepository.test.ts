import { knex_connection } from "@/database/knex";
import { Race } from "@/domain/entity/Race/Race";
import { Transaction } from "@/domain/entity/Transaction";
import { RaceRepositoryDatabase } from "@/infra/repository/database/RaceRepositoryDatabase";
import { TransactionDatabaseRepository } from "@/infra/repository/database/TransactionDatabaseRepository";
import { randomUUID } from "crypto";
import cleaner from "knex-cleaner";

const raceRepository = new RaceRepositoryDatabase();
const transactionRepository = new TransactionDatabaseRepository();

beforeEach(async () => {
    await cleaner.clean(knex_connection);
});

test("Deve ser possível criar uma transação e obtê la!", async function () {
    const race = Race.create(1);
    race.setPrice(100);
    await raceRepository.save(race);

    const transaction_id = randomUUID();
    const race_id = race.id;

    const transaction = Transaction.create(transaction_id, race_id, race.getPrice(), "approved", "johnDoe@gmail.com");
    await transactionRepository.save(transaction);

    const output = await transactionRepository.getByTid(transaction_id);
    expect(output.userEmail.value).toBe("johnDoe@gmail.com");
    expect(output.price).toBe(100);
    expect(output.status).toBe("approved");
});

test("Deve lançar um erro casso a transação nao exista", async function () {
    const promise = transactionRepository.getByTid(randomUUID());
    await expect(() => promise).rejects.toThrow(new Error("Transaction not found"));
});

afterAll(async () => {
    await raceRepository.close();
    await transactionRepository.close();
});
