import { sendContactMail } from "@/lib/contactMail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        await sendContactMail({ name, email, message });

        return NextResponse.json(
            { success: true, message: "Message sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("CONTACT ERROR:", error);

        return NextResponse.json(
            { message: "Failed to send message" },
            { status: 500 }
        );
    }
}
