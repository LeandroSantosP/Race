export type message = { from: string; to: string; message: string };
export interface IMailerRepository {
    save(message: message): Promise<void>;
}
