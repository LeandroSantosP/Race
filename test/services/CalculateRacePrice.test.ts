import { Route } from "@/domain/entity/Race/Route";
import { CalculateRacePrice } from "@/domain/services/CalculateRacePrice";

test("Deve calcular o preço total de uma corrida", function () {
    const calculateRacePrice = new CalculateRacePrice();

    const price = calculateRacePrice.calculate([new Route(44, new Date("2021-01-10T10:00:00"))]);

    expect(price).toBe(105.6);
});

test("Deve cobra a taxa de 10 e 2.4 casso seja fim de semana e a noite.", async function () {
    const calculateRacePrice = new CalculateRacePrice();
    const routes_drives = [new Route(20, new Date("2021-01-10T20:00:00"))];

    const price = calculateRacePrice.calculate(routes_drives);

    expect(price).toBe(53);
});

test("Deve cobra a taxa de 10 casso seja a noite.", async function () {
    const calculateRacePrice = new CalculateRacePrice();
    const routes_drives = [new Route(20, new Date("2021-01-01T20:00:00"))];

    const price = calculateRacePrice.calculate(routes_drives);

    expect(price).toBe(33);
});

test("Deve ser possível calcular o preço da corrida durante o fim de semana com taxa de 2.4", async function () {
    const calculateRacePrice = new CalculateRacePrice();
    const routes_drives = [new Route(44, new Date("2021-01-10T10:00:00"))];

    const price = calculateRacePrice.calculate(routes_drives);

    expect(price).toBe(105.6);
});

test("A corrida tem um valor mínimo de 15", async function () {
    const calculateRacePrice = new CalculateRacePrice();
    const routes_drives = [new Route(5, new Date("2021-01-10T10:00:00"))];

    const price = calculateRacePrice.calculate(routes_drives);

    expect(price).toBe(15);
});
