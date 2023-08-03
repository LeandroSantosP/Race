import { IHandler } from "./Handle";
import { DriverAcceptEvent } from "@/domain/event/DriverAcceptEvent";
import { IMailer } from "../service/IMailer";
import { Message } from "@/domain/entity/Message";
import { IMailerRepository } from "../repository/IMailerRepository";

export class DriverAcceptHandler implements IHandler {
    eventName = "DriverAccept";

    constructor(private readonly mailerService: IMailer, private readonly mailerRepository: IMailerRepository) {}

    async handle(event: DriverAcceptEvent): Promise<void> {
        const message = `Ola sua corrida foi aceita com secusse pelo motorista ${event.driverName}, esta a caminho..., PLACA DE CARRO: ${event.carPlate}`;
        await this.mailerService.sendEmail("mycompany@emaik.com", event.passengerEmail, message);
        const messageEntity = Message.create("mycompany@emaik.com", event.passengerEmail, message);
        await this.mailerRepository.save(messageEntity);
    }
}
