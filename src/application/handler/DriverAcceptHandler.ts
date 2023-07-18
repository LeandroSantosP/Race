import { IHandler } from "./Handle";
import { DriverAcceptEvent } from "@/domain/event/DriverAcceptEvent";
import { IMailer } from "../service/IMailer";

export class DriverAcceptHandler implements IHandler {
    eventName = "DriverAccept";

    constructor(private readonly mailerService: IMailer) {}

    async handle(event: DriverAcceptEvent): Promise<void> {
        const message = `Ola sua corrida foi aceita com secusse pelo motorista ${event.driverName}, esta a caminho..., PLACA DE CARRO: ${event.carPlate}`;
        await this.mailerService.sendEmail("mycompany@emaik.com", event.passengerEmail, message);
    }
}
