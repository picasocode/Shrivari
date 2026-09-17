import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { enquiryEmailHtml, sendMail } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const contactMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || "",
        subject: subject || "",
        message,
      },
    });

    // Email the enquiry to the company mailbox using the SMTP credentials
    // configured in the admin panel (Mail Settings). Never fails the form:
    // the message is already saved — mail delivery problems are reported
    // in the response but ignored otherwise.
    const mail = await sendMail(
      subject ? `New Website Enquiry: ${subject}` : "New Website Enquiry",
      enquiryEmailHtml({ name, email, phone, subject, message })
    ).catch((err) => ({ sent: false, error: String(err) }));

    return NextResponse.json(
      { ...contactMessage, emailed: mail.sent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting contact message:", error);
    return NextResponse.json(
      { error: "Failed to submit contact message" },
      { status: 500 }
    );
  }
}
