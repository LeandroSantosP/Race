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
    router.setStatus("approved");
    expect(router.status).toBe("approved");
});

test("Deve ser possível calcular o preço da corrida durante o fim de semana com taxa de 2.4", async function () {
    const routes_drives = [
        {
            distance: 44,
            date: new Date("2021-01-10T10:00:00"),
        },
    ];

    const router = Race.create(1);

    for (const route_drive of routes_drives) {
        router.addRoutes(new Route(route_drive.distance, route_drive.date));
    }

    const price = router.getPrice();
    expect(price).toBe(105.6);
});

test("A corrida tem um valor mínimo de 15", async function () {
    const routes_drives = [
        {
            distance: 5,
            date: new Date("2021-01-10T10:00:00"),
        },
    ];

    const router = Race.create(1);

    for (const route_drive of routes_drives) {
        router.addRoutes(new Route(route_drive.distance, route_drive.date));
    }

    const price = router.getPrice();
    expect(price).toBe(15);
});

test("Deve cobra a taxa de 10 casso seja a noite.", async function () {
    const routes_drives = [
        {
            distance: 20,
            date: new Date("2021-01-01T20:00:00"),
        },
    ];

    const router = Race.create(1);

    for (const route_drive of routes_drives) {
        router.addRoutes(new Route(route_drive.distance, route_drive.date));
    }

    const price = router.getPrice();
    expect(price).toBe(33);
});

test("Um passageiro e um motorista deve aceitar uma corrida", async function () {
    const race = Race.create(1);

    const routes_drives = [
        {
            distance: 20,
            date: new Date("2021-01-01T20:00:00"),
        },
    ];

    for (const route_drive of routes_drives) {
        race.addRoutes(new Route(route_drive.distance, route_drive.date));
    }

    const matchPassengerInput = await Passenger.create("John doe", "joe.doe@gmail.com", "senha123", 22, "78361717102");
    const matchDriverInput = Driver.create("Michael", 30, "57078574273", "AAA-1111");
    race.matchPassenger(matchPassengerInput);
    race.matchDriver(matchDriverInput);

    race.setStatus("approved");

    const passenger = race.getPassenger();
    const driver = race.getDriver();

    expect(passenger?.cpf).toBe("78361717102");
    expect(passenger?.status).toBe("approved");
    expect(driver).not.toBeNull();
    expect(driver?.cpf).toBe("57078574273");
    expect(driver?.status).toBe("approved");
});

test("Deve cobra a taxa de 10 e 2.4 casso seja fim de semana e a noite.", async function () {
    const routes_drives = [
        {
            distance: 20,
            date: new Date("2021-01-10T20:00:00"),
        },
    ];

    const router = Race.create(1);

    for (const route_drive of routes_drives) {
        router.addRoutes(new Route(route_drive.distance, route_drive.date));
    }

    const price = router.getPrice();
    expect(price).toBe(53);
});

test("Deve validar se a corrida e no fim de semana", function () {
    const route = new Route(10, new Date("2021-01-10T10:00:00"));
    expect(route.isWeekend()).toBeTruthy();
});

test("Deve finalizar uma corrida retornando o total pago e o tempo dela", function () {
    const race = Race.create(1, "123", new Date("2021-01-10T10:00:00"));

    const routes_drives = [
        {
            distance: 20,
            date: new Date("2021-01-01T20:00:00"),
        },
    ];

    for (const route_drive of routes_drives) {
        race.addRoutes(new Route(route_drive.distance, route_drive.date));
    }

    const race_in_hors = race.fishedRace(new Date("2021-01-10T12:00:00"));

    expect(race_in_hors).toBe(2);

    expect(race.fishedRace).toBeTruthy();
});
