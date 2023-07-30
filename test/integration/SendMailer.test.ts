import { MailerServiceAdapterNodeMailer } from "@/infra/services/MailerServiceAdapterNodeMailer";

test("Deve enviar um email", async function () {
    const sendMailer = new MailerServiceAdapterNodeMailer();

    const input = {
        to: "joeDoe@gmail.com",
        from: "test@gmail.com",
        message: "Hello world",
    };

    await sendMailer.sendEmail(input.from, input.to, input.message);
});
