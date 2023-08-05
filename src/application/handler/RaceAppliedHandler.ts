import { IHandler } from "./Handle";
import { IRaceRepository } from "../repository/IRaceRepository";
import { ITransactionRepository } from "../repository/ITransactionRepository";
import { IGatewayPayment } from "../service/IGatewayPayment";
import { RaceAppliedEvent } from "@/domain/event/RaceAppliedEvent";
import { Transaction } from "@/domain/entity/Transaction";
import { IPassengerRepository } from "../repository/IPassengerRepository";

export class RaceAppliedHandler implements IHandler {
    eventName = "RaceApplied";

    constructor(
        private readonly gatewayPayment: IGatewayPayment,
        private readonly transactionRepository: ITransactionRepository,
        private readonly raceRepository: IRaceRepository,
        private readonly passengerRepository: IPassengerRepository
    ) {}

    async handle(event: RaceAppliedEvent): Promise<void> {
        const race = await this.raceRepository.get(event.raceId);

        const transactionData = await this.gatewayPayment.createTransaction({
            creditCardToken: event.creditCardToken,
            email: event.passengerEmail,
            price: race.getPrice(),
        });

        const transaction = Transaction.create(
            transactionData.tid,
            race.id,
            race.getPrice(),
            transactionData.status,
            event.passengerEmail
        );

        const passenger = await this.passengerRepository.getByEmail(event.passengerEmail);

        await this.transactionRepository.save(transaction);
        race.setStatus("waiting_driver");
        race.matchPassenger(passenger);

        await this.raceRepository.update(race);
    }
}
