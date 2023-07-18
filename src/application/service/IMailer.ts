export interface IMailer {
    sendEmail(from: string, to: string, message: string): Promise<void>;
}
