import { IHandler } from "./Handle";
import { DriverAcceptEvent } from "@/domain/event/DriverAcceptEvent";
import { Message } from "@/domain/entity/Message";
import { IMailerRepository } from "../repository/IMailerRepository";
import { QueueBackgroundJobController } from "@/infra/services/QueueBackgroundJobController";

export class DriverAcceptHandler implements IHandler {
    eventName = "DriverAccept";

    constructor(
        private readonly queueJobController: QueueBackgroundJobController,
        private readonly mailerRepository: IMailerRepository
    ) {}

    async handle(event: DriverAcceptEvent): Promise<void> {
        const message = `Ola sua corrida foi aceita com secusse pelo motorista ${event.driverName}, esta a caminho..., PLACA DE CARRO: ${event.carPlate}`;
        const mailerJobInput = { from: "mycompany@emaik.com", to: event.passengerEmail, message };
        await this.queueJobController.publishOnQueue("MailerJob", mailerJobInput);

        const messageEntity = Message.create("mycompany@emaik.com", event.passengerEmail, message);
        await this.mailerRepository.save(messageEntity);
    }
}
