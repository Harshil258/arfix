import nodemailer from "nodemailer";

type MailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

let transporter: nodemailer.Transporter | null = null;

const createTransporter = async () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NODE_ENV } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT ? Number(SMTP_PORT) : 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    return transporter;
  }

  // Fallback to Ethereal test account in development
  if (NODE_ENV === "development") {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    return transporter;
  }

  throw new Error("No SMTP configuration found for sending emails.");
};

export const sendMail = async ({ to, subject, text, html }: MailOptions) => {
  const tx = await createTransporter();
  const info = await tx.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER || "no-reply@arfix.local",
    to,
    subject,
    text,
    html,
  });

  // If using Ethereal, log the preview URL
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (nodemailer.getTestMessageUrl && (info as any).messageId) {
    const url = nodemailer.getTestMessageUrl(info as any);
    if (url) console.info("Preview email:", url);
  }

  return info;
};

export default { sendMail };
