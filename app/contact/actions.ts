"use server";
import nodemailer from "nodemailer";

interface EmailData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const emailData: EmailData = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    company: (formData.get("company") as string) || undefined,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  };

  if (
    !emailData.firstName ||
    !emailData.lastName ||
    !emailData.email ||
    !emailData.subject ||
    !emailData.message
  ) {
    return {
      success: false,
      message: "Please fill in all required fields.",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailData.email)) {
    return {
      success: false,
      message: "Invalid email format.",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for port 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER, // you can change to a fixed admin address
      subject: `New Message: ${emailData.subject}`,
      replyTo: emailData.email,
      text: `
From: ${emailData.firstName} ${emailData.lastName}
Email: ${emailData.email}
Company: ${emailData.company || "N/A"}
Subject: ${emailData.subject}

${emailData.message}
      `,
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM, // still you
      to: emailData.email, // user who submitted
      subject: "Thanks for reaching out to Echo!",
      text: `
Hi ${emailData.firstName},

Thank you for contacting Echo. We've received your message and will get back to you shortly.

If your request is urgent, feel free to reply to this email.

Best,  
The Echo Team

— Echo | Where ideas find their voice
  `,
    });

    return {
      success: true,
      message: "Your message has been sent!",
    };
  } catch (error) {
    console.error("Nodemailer error:", error);
    return {
      success: false,
      message: "Failed to send message. Please try again later.",
    };
  }
}
