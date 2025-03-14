import nodemailer from "nodemailer";
import logger from "../lib/logger";
import type { Address } from "nodemailer/lib/addressparser";
import { Attachment } from "nodemailer/lib/mailer";
import emailWelcome from "./templates/emailWelcome";
import emailVerification from "./templates/emailVerification";
import { encryptData } from "@/lib/crypto";
import { EmailVerificationStep } from "@/types/auth.enum";

class Mailer {
  constructor() {}

  private getTransporter() {
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_SERVER,
      port: parseInt(process.env.BREVO_SMTP_PORT),
      secure: process.env.NODE_ENV === "production",
      auth: {
        user: process.env.BREVO_SMTP_LOGIN,
        pass: process.env.BREVO_SMTP_PASSWORD,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    return transporter;
  }

  private async sendBrevoEmail(
    subject: string,
    htmlContent: string,
    to: Address,
    attachments?: Attachment[]
  ) {
    try {
      const transporter = this.getTransporter();

      const info = await transporter.sendMail({
        from: `${process.env.BREVO_SENDER_NAME} <${process.env.BREVO_SENDER_EMAIL}>`,
        to: to,
        subject,
        html: htmlContent,
        attachments,
      });

      logger.success("[BREVO EMAIL SENT]", JSON.stringify(info, null, 2));
    } catch (err) {
      logger.error("[BREVO EMAIL ERROR]", err);
    }
  }

  public async sendWelcomeEmail(to: Address) {
    const subject = "¡Bienvenido a Cóndor-AI!";
    const htmlContent = emailWelcome();
    await this.sendBrevoEmail(subject, htmlContent, to);
  }

  public async sendEmailVerificationEmail(
    to: Address,
    code: string,
    userId: string
  ) {
    const subject = "Verifica tu correo electrónico - Cóndor-AI";
    const htmlContent = emailVerification(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/auth/email-verification?state=${encryptData({
        code,
        step: EmailVerificationStep.start,
        userId,
      })}`
    );
    await this.sendBrevoEmail(subject, htmlContent, to);
  }
}

const mailer = new Mailer();

export default mailer;
