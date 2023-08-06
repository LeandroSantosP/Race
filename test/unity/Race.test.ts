import { Driver } from "@/domain/entity/Driver";
import { Passenger } from "@/domain/entity/Passenger";
import { Race } from "@/domain/entity/Race/Race";
import { Route } from "@/domain/entity/Race/Route";

test("Deve criar uma rota ", function () {
    const router = Race.create(1);
    expect(router).toBeDefined();
});

test("Deve criar uma corrida", function () {
    const router = Race.create(1);
    expect(router).toBeDefined();
});

test("deve ser possível aprovar/rejeitar uma corrida", async function () {
    const router = Race.create(1);
    expect(router.status).toBe("waiting");
    router.setStatus("waiting_driver");
    expect(router.status).toBe("waiting_driver");
});

test("deve lançar um erro casso o status seja invalido!", async function () {
    const router = Race.create(1);
    expect(router.status).toBe("waiting");
    expect(() => router.setStatus("invalid_status")).toThrow(new Error("Invalid Status"));
});

test("Um passageiro e um motorista deve aceitar uma corrida", async function () {
    const race = Race.create(1);

    const matchPassengerInput = await Passenger.create("John doe", "joe.doe@gmail.com", "senha123", 22, "78361717102");
    const matchDriverInput = Driver.create("Michael", 30, "57078574273", "AAA-1111");
    race.matchPassenger(matchPassengerInput);
    race.matchDriver(matchDriverInput);

    race.setStatus("waiting_driver");

    const passenger = race.getPassenger();
    const driver = race.getDriver();

    expect(passenger?.cpf).toBe("78361717102");
    expect(passenger?.status).toBe("waiting_driver");
    expect(driver).not.toBeNull();
    expect(driver?.cpf).toBe("57078574273");
    expect(driver?.status).toBe("waiting_driver");
});

test("Deve validar se a corrida e no fim de semana", function () {
    const route = new Route(10, new Date("2021-01-10T10:00:00"));
    expect(route.isWeekend()).toBeTruthy();
});

test("Deve finalizar uma corrida retornando o total pago e o tempo dela", function () {
    const race = Race.create(1, "123", new Date("2021-01-10T10:00:00"));
    const race_in_hors = race.fishedRace(new Date("2021-01-10T12:00:00"));

    expect(race_in_hors).toBe(2);

    expect(race.fishedRace).toBeTruthy();
});
