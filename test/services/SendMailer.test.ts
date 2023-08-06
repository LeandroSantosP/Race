import { MailerJobAdapterNodeMailer } from "@/infra/jobs/MailerJobAdapterNodeMailer";
import { randomUUID } from "crypto";

const sendMailer = new MailerJobAdapterNodeMailer();

test.skip("Deve enviar um email", async function () {
    const input = {
        to: "joe.doe@gmail.com",
        from: "test.123@gmail.com",
        message: "Hello world",
        id: randomUUID(),
    };

    await expect(
        sendMailer.handle({
            from: input.from,
            to: input.to,
            message: input.message,
        })
    ).resolves.toBeUndefined();
});

afterAll(async () => {
    await sendMailer.close();
});
