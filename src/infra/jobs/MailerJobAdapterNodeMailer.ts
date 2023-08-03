import nodemailer from "nodemailer";
import NodeMailerConfig from "@/config/NodeMailerConfig";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { Job } from "@/application/interfaces/Job";

export class MailerJobAdapterNodeMailer implements Job {
    transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    name = "MailerJob";

    constructor() {
        this.transport = nodemailer.createTransport(NodeMailerConfig as any);
    }
    async handle(data: { from: string; to: string; message: string }): Promise<void> {
        await this.transport.sendMail({
            from: data.from,
            to: data.to,
            html: data.message,
        });
    }

    async close(): Promise<void> {
        this.transport.close();
    }
}
