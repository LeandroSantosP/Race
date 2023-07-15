import { CalculateRaceUsecase } from "@/application/usecase/CalculateRaceUsecase";

test("Deve ser possível calcular o preço da corrida durante o dia com taxa de 1.4.", async function () {
    const calculateRace = new CalculateRaceUsecase();

    const input = {
        routes_drives: [
            {
                distance: 25,
                date: new Date("2021-01-01T10:00:00"),
            },
            {
                distance: 15,
                date: new Date("2021-01-08T10:00:00"),
            },
        ],
    };

    const output = await calculateRace.execute(input);
    expect(output.price).toBe(56);
});
