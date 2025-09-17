import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "e1356b07c9d09c",
        pass: "f337bc0c1ca48d"
    }
});