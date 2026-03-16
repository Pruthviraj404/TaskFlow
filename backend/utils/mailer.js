import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS 
  }
});

export const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: '"TaskFlow" <your_gmail@gmail.com>',
    to: email,
    subject: "Your TaskFlow Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #2563eb;">TaskFlow</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 8px; color: #111827; font-size: 40px; margin: 16px 0;">${otp}</h1>
        <p style="color: #6b7280; font-size: 13px;">This code expires in <strong>10 minutes</strong>. Do not share it.</p>
      </div>
    `
  });
};


export const sendPasswordResetEmail = async (email, otp) => {
  await transporter.sendMail({
    from: '"TaskFlow" <your_gmail@gmail.com>',
    to: email,
    subject: "Reset Your TaskFlow Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #2563eb;">TaskFlow</h2>
        <p>You requested a password reset. Your OTP is:</p>
        <h1 style="letter-spacing: 8px; color: #111827; font-size: 40px; margin: 16px 0;">${otp}</h1>
        <p style="color: #6b7280; font-size: 13px;">This code expires in <strong>10 minutes</strong>. If you did not request this, ignore this email.</p>
      </div>
    `
  });
};

export const sendTaskReminderEmail = async (email, task, minutesBefore) => {
  const label = minutesBefore === 0 ? "right now" : `in ${minutesBefore} minutes`;

  await transporter.sendMail({
    from: '"TaskFlow" <your_gmail@gmail.com>',
    to: email,
    subject: `⏰ Reminder: "${task.title}" is due ${label}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 28px; border: 1px solid #e5e7eb; border-radius: 16px;">
        
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
          <h2 style="color: #2563eb; margin: 0;">TaskFlow</h2>
          <span style="background: #eff6ff; color: #2563eb; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 999px;">Reminder</span>
        </div>

        <p style="color: #374151; font-size: 15px; margin-bottom: 20px;">
          Your task is due <strong>${label}</strong>. Here are the details:
        </p>

        <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #111827; margin: 0 0 12px 0; font-size: 18px;">${task.title}</h3>
          
          ${task.description ? `
          <p style="color: #6b7280; font-size: 13px; margin: 0 0 12px 0;">
            ${task.description}
          </p>` : ''}

          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr>
              <td style="color: #9ca3af; padding: 4px 0; width: 100px;">📅 Due Date</td>
              <td style="color: #111827; font-weight: 600;">${task.due_date}</td>
            </tr>
            ${task.due_time ? `
            <tr>
              <td style="color: #9ca3af; padding: 4px 0;">🕐 Due Time</td>
              <td style="color: #111827; font-weight: 600;">${formatTime12hr(task.due_time)}</td>
            </tr>` : ''}
            <tr>
              <td style="color: #9ca3af; padding: 4px 0;">🏷️ Category</td>
              <td style="color: #111827; font-weight: 600; text-transform: capitalize;">${task.category || 'N/A'}</td>
            </tr>
            <tr>
              <td style="color: #9ca3af; padding: 4px 0;">🔴 Priority</td>
              <td style="color: ${task.priority === 'high' ? '#dc2626' : task.priority === 'medium' ? '#d97706' : '#16a34a'}; font-weight: 600; text-transform: capitalize;">${task.priority || 'N/A'}</td>
            </tr>
          </table>
        </div>

        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          You're receiving this because you have task reminders enabled in TaskFlow.
        </p>
      </div>
    `
  });
};

function formatTime12hr(time) {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}