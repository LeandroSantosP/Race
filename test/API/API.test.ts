import { knex_connection } from "@/database/knex";
import axios from "axios";
import { randomUUID } from "crypto";
import cleaner from "knex-cleaner";
const base_URL = "http://localhost:3333";

beforeEach(async () => {
    await cleaner.clean(knex_connection);
});

test("Deve Testar a api - (Calculate Race)", async function () {
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
    const response = await axios.post(`${base_URL}/calculate-race`, input);
    const output = response.data;

    expect(output.price).toBe(56);
});

test("Deve Testar a api - (Calculate Driver)", async function () {
    const input = {
        name: "John doe",
        age: 20,
        cpf: "57725542809",
        plate_car: "AAA-1244",
    };
    await axios.post(`${base_URL}/create-driver`, input);

    const response = await axios.get(`${base_URL}/driver-by-cpf/${input.cpf}`);
    const output = response.data;

    expect(output.driverName).toBe("John doe");
    expect(output.age).toBe(20);
    expect(output.cpf).toBe("57725542809");
    expect(output.plate_car).toBe("AAA-1244");
});

test("Deve Testar a api - (Calculate Passenger)", async function () {
    const input = {
        name: "Michael Joe",
        email: "michael.doe@gmail.com",
        password: "senha123",
        cpf: "75704900615",
        age: 20,
    };
    await axios.post(`${base_URL}/create-passenger`, input);

    const [output] = await knex_connection("passenger").where("cpf", input.cpf);

    expect(output.passenger_name).toBe("Michael Joe");
    expect(output.age).toBe(20);
    expect(output.cpf).toBe("75704900615");
    expect(output.email).toBe("michael.doe@gmail.com");
});
