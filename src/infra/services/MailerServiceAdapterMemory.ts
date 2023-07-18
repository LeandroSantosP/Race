import { IMailer } from "@/application/service/IMailer";

export class MailerServiceAdapterMemory implements IMailer {
    messages: { from: string; to: string; message: string }[] = [];
    async sendEmail(from: string, to: string, message: string): Promise<void> {
        this.messages.push({ from, message, to });
        console.log("Email Enviado com sucesso!");
    }
}
