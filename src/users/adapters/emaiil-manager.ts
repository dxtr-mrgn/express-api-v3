const nodemailer = require("nodemailer");

export const emailManager = {
    async sendEmailConfirmation(email: string, message: string): Promise<void> {
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "dexter.morgan.random@gmail.com",
                pass: "uszd qdmo vopb tzub",
            },
        });

        let info = await transporter.sendMail({
            from: 'Dexter Morgan',
            to: email,
            subject: 'New Post',
            html: message,
        })
    }
}