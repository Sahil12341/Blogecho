import nodemailer from "nodemailer"
export async function sendContactEmail(name: string, email: string, message: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or any SMTP provider
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  await transporter.sendMail({
  from: `"${name}" <${process.env.EMAIL_USER}>`,  // From your address
  to: process.env.EMAIL_USER,                     // To your address
  subject: "New Contact Message",
  html: `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong><br/>${message}</p>
  `,
  replyTo: email, // This lets you "Reply" to the actual sender!
});

}
