import { Passenger } from "@/domain/entity/Passenger";

test("Deve ser possível criar um passageiro", async function () {
    const passenger = await Passenger.create("Michael Doe", "michael.doe@gmail.com", "senha123", 20, "75704900615");
    expect(passenger).toBeDefined();
});
