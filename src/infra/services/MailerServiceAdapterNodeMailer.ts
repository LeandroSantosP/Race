import { IMailerRepository } from "@/application/repository/IMailerRepository";
import { IMailer } from "@/application/service/IMailer";
import NodeMailerConfig from "@/config/NodeMailerConfig";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export class MailerServiceAdapterNodeMailer implements IMailer {
    transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    constructor(private readonly mailerRepository: IMailerRepository) {
        this.transport = nodemailer.createTransport(NodeMailerConfig);
    }
    async sendEmail(from: string, to: string, message: string): Promise<void> {
        await this.transport.sendMail({
            from,
            to,
            html: message,
        });
        await this.mailerRepository.save({ from, to, message });
    }
}
