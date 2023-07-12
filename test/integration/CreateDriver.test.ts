import { CreateDriverUsecase } from "@/application/usecase/CreateDriverUsecase";
import { GetDriverUsecase } from "@/application/usecase/GetDriverUsecase";
import { DriverRepositoryMemory } from "@/infra/repository/DriverRepositoryMemory";

test("Deve cadastra um motorista e obter ele.", async function () {
    const driverRepository = new DriverRepositoryMemory();

    const createDriver = new CreateDriverUsecase(driverRepository);

    const createDriverInput = {
        name: "John doe",
        age: 20,
        cpf: "57725542809",
        plate_car: "AAA-1244",
    };

    await createDriver.execute(createDriverInput);

    const getDriver = new GetDriverUsecase(driverRepository);

    const getDriverInput = "57725542809";

    const output = await getDriver.execute(getDriverInput);

    expect(output.driverName).toBe("John doe");
    expect(output.age).toBe(20);
    expect(output.cpf).toBe("57725542809");
    expect(output.plate_car).toBe("AAA-1244");
});
