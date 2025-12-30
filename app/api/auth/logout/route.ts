import { deleteSession } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session")?.value;

        if (token) {
            await deleteSession(token);
        }

        // Clear the session cookie
        cookieStore.delete("session");

        return NextResponse.json(
            { message: "Logged out successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { message: "Failed to logout" },
            { status: 500 }
        );
    }
}
