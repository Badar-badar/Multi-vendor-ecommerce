import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { addEmailJob } from '../queues/emailQueue.js';

/**
 * Creates and configures the nodemailer transport
 */
const createTransporter = () => {
  if (config.mail.host && config.mail.user) {
    return nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      auth: {
        user: config.mail.user,
        pass: config.mail.password,
      },
    });
  }
  return null;
};

const transporter = createTransporter();

/**
 * Sends an email with HTML/text content
 */
export const sendEmailNow = async ({ to, subject, html, text }) => {
  try {
    if (!transporter) {
      logger.info(`[Email Service - Dev Mode] Email to <${to}> with subject: "${subject}"`);
      if (text) logger.info(`[Email Body Text]:\n${text}`);
      return { messageId: 'dev-mode-simulated-id' };
    }

    const info = await transporter.sendMail({
      from: config.mail.from,
      to,
      subject,
      text,
      html,
    });

    logger.info(`[Email Service] Email sent successfully to <${to}> (ID: ${info.messageId})`);
    return info;
  } catch (error) {
    logger.error(`[Email Service] Failed to send email to <${to}>: ${error.message}`);
    // Non-fatal: do not throw to prevent blocking auth flow
    return null;
  }
};

/**
 * Queues an email for background delivery, with direct-send fallback when Redis
 * is unavailable.
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const job = await addEmailJob('send-email', { to, subject, html, text });
  if (job) {
    logger.info(`[Email Service] Email queued for <${to}> (Job ID: ${job.id})`);
    return job;
  }

  return sendEmailNow({ to, subject, html, text });
};

/**
 * Sends an email verification link
 */
export const sendVerificationEmail = async (user, rawToken) => {
  const verificationUrl = `${config.clientUrl}/verify-email?token=${rawToken}`;
  const subject = 'Verify your Zareen Sovereign Account';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #F0E2E6; border-radius: 16px; background-color: #FCFAF7;">
      <h2 style="color: #251C20; font-family: serif;">Welcome to Zareen, ${user.name}</h2>
      <p style="color: #5E5256; line-height: 1.6;">Thank you for registering your patron account. Please verify your email address to unlock full member privileges.</p>
      <div style="margin: 28px 0;">
        <a href="${verificationUrl}" style="background-color: #DB8296; color: #FFFFFF; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Verify Email Address</a>
      </div>
      <p style="color: #8E8286; font-size: 12px;">If you did not create an account with Zareen, you can safely disregard this email.</p>
    </div>
  `;
  const text = `Welcome to Zareen, ${user.name}.\nPlease verify your email by opening: ${verificationUrl}`;

  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Sends a password reset link
 */
export const sendPasswordResetEmail = async (user, rawToken) => {
  const resetUrl = `${config.clientUrl}/reset-password?token=${rawToken}`;
  const subject = 'Zareen Account — Password Reset Instructions';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #F0E2E6; border-radius: 16px; background-color: #FCFAF7;">
      <h2 style="color: #251C20; font-family: serif;">Password Reset Request</h2>
      <p style="color: #5E5256; line-height: 1.6;">We received a request to reset your password. Click the button below to choose a new secure password. This link is valid for 1 hour.</p>
      <div style="margin: 28px 0;">
        <a href="${resetUrl}" style="background-color: #DB8296; color: #FFFFFF; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #8E8286; font-size: 12px;">If you did not request a password reset, please ignore this email or contact concierge support immediately.</p>
    </div>
  `;
  const text = `Password Reset Request for Zareen.\nPlease reset your password within 1 hour using: ${resetUrl}`;

  return sendEmail({ to: user.email, subject, html, text });
};

export default {
  sendEmail,
  sendEmailNow,
  sendVerificationEmail,
  sendPasswordResetEmail,
};
