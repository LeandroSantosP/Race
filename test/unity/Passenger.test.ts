import { Passenger } from "@/domain/entity/Passenger";
import { randomUUID } from "crypto";

test("Deve ser possível criar um passageiro", async function () {
    const passenger = await Passenger.create("Michael Doe", "michael.doe@gmail.com", "senha123", 20, "75704900615");
    expect(passenger).toBeDefined();
});

test("Deve ser possível restaurar o estado de Passenger", function () {
    const passengerRestored = Passenger.recreate(
        randomUUID(),
        "Michael Doe",
        "michael.doe@gmail.com",
        "senha123",
        10,
        18,
        "75704900615"
    );
    expect(passengerRestored).toBeDefined();
});
