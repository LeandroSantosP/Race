import { Route } from "@/domain/entity/Race/Route";
import { CalculateRacePrice } from "@/domain/services/CalculateRacePrice";

test("Deve calcular o preço total de uma corrida", function () {
    const calculateRacePrice = new CalculateRacePrice();

    const price = calculateRacePrice.calculate([new Route(44, new Date("2021-01-10T10:00:00"))]);

    expect(price).toBe(105.6);
});
