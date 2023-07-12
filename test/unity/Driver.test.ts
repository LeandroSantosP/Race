import { Driver } from "@/domain/entity/Driver";

test("Deve criar um motorista", function () {
    const driver = Driver.create("John Doe", 20, "57725542809", "BBB-2324", "12345");
    expect(driver).toBeDefined();
});

test("Nao deve criar um motorista com idade inferior a 18 anos.", function () {
    expect(() => Driver.create("John Doe", 16, "57725542809", "BBB-2324", "12345")).toThrow(
        new Error("Driver must be greater than 18 yeas old.")
    );
});

test("Nao deve criar um motorista com um cpf invalido.", function () {
    expect(() => Driver.create("John Doe", 20, "00000000000", "BBB-2324", "12345")).toThrow(new Error("Invalid Cpf"));
});

test("Nao deve criar um motorista com um placa invalida.", function () {
    expect(() => Driver.create("John Doe", 20, "57725542809", "BBB-23240", "12345")).toThrow(
        new Error("Invalid Plate")
    );
});
