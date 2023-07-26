import { CreatePassengerUsecase } from "@/application/usecase/CreatePassengerUsecase";
import { knex_connection } from "@/database/knex";
import { PassengerRepositoryMemory } from "@/infra/repository/PassengerRepositoryMemory";
import { PassengerRepositoryDatabase } from "@/infra/repository/database/PassengerRepositoryDatabase";
import cleaner from "knex-cleaner";

const passengerRepository = new PassengerRepositoryDatabase();

beforeEach(async () => {
    await cleaner.clean(knex_connection);
});

test("Deve ser possível criar um passageiro", async function () {
    // const passengerRepository = new PassengerRepositoryMemory();
    const createPassenger = new CreatePassengerUsecase(passengerRepository);

    const createPassengerInput = {
        name: "Michael Joe",
        email: "michael.doe@gmail.com",
        password: "senha123",
        cpf: "75704900615",
        age: 20,
    };

    await createPassenger.execute(createPassengerInput);

    const passengerCreated = await passengerRepository.getByDocument("75704900615");
    expect(passengerCreated).toBeDefined();
    expect(passengerCreated).toHaveProperty("id");
});

afterAll(async () => {
    await passengerRepository.close();
});
