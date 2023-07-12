import { CreatePassengerUsecase } from "@/application/usecase/CreatePassengerUsecase";
import { PassengerRepositoryMemory } from "@/infra/repository/PassengerRepositoryMemory";

test("Deve ser possível criar um passageiro", async function () {
    const passengerRepository = new PassengerRepositoryMemory();
    const createPassenger = new CreatePassengerUsecase(passengerRepository);

    const createPassengerInput = {
        name: "Michael Joe",
        email: "michael.doe@gmail.com",
        password: "senha123",
        cpf: "75704900615",
        age: 20,
    };

    await createPassenger.execute(createPassengerInput);

    // const getPassenger = new GetPassengerUsecase();
    // const getPassengerInput = "75704900615";
    // const output = await getPassenger.execute(getPassengerInput);
});
