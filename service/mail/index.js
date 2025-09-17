import {transporter} from "../../mail.js";

export class MailService {
    async sendActivationMail(to, link) {
        try {
            const mailOptions = {
                from: '"MyApp" <no-reply@myapp.com>',
                to,
                subject: "Registration Confirmation",
                html: `
          <h2>Welcome!</h2>
          <p>Click the link below to confirm your email:</p>
          <a href="${link}">${link}</a>
        `,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log("Activation email sent:", info.messageId);
        } catch (err) {
            console.error("Error sending activation email:", err);
            throw new Error("Failed to send email");
        }
    }

    async sendForgotPasswordMail(to, link) {
        try {
            const mailOptions = {
                from: '"MyApp" <no-reply@myapp.com>',
                to,
                subject: "Reset Your Password",
                html: `
          <h2>Password Reset</h2>
          <p>Click the link below to reset your password. This link expires in 30 minutes:</p>
          <a href="${link}">${link}</a>
        `,
            };
            const info = await transporter.sendMail(mailOptions);
            console.log("Reset password email sent:", info.messageId);
        } catch (err) {
            console.error("Error sending reset password email:", err);
            throw new Error("Failed to send email");
        }
    }
}

export default new MailService();
