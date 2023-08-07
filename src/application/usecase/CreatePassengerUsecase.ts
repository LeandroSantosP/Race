import { Passenger } from "@/domain/entity/Passenger";
import { IPassengerRepository } from "../repository/IPassengerRepository";
import { Application } from "../interfaces/Application";

export class CreatePassengerUsecase implements Application {
    constructor(private readonly passengerRepository: IPassengerRepository) {}

    async execute(input: Input): Promise<void> {
        const passengerAlreadyExits = await this.passengerRepository.getByDocument(input.cpf);
        if (passengerAlreadyExits) throw new Error("Passenger already Exits!");
        const passenger = await Passenger.create(input.name, input.email, input.password, input.age, input.cpf);
        await this.passengerRepository.save(passenger);
    }
}

type Input = {
    name: string;
    email: string;
    password: string;
    cpf: string;
    age: number;
};
