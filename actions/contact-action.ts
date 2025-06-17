"use server";

import { contactSchema } from "@/lib/zodSchema";
import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/lib/mail";
import { z } from "zod";

export async function handleContactSubmit(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    // Optional: return error details
    const errorMessages = parsed.error.flatten().fieldErrors;
    throw new Error("Validation failed: " + JSON.stringify(errorMessages));
  }

  const { name, email, message } = parsed.data;

  // Save to DB
  await prisma.contact.create({
    data: { name, email, message },
  });

  // Send Email
  await sendContactEmail(name, email, message);

  return { success: true };
}
