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

        // Create response
        const response = NextResponse.json(
            { message: "Logged out successfully" },
            { status: 200 }
        );

        // Clear the session cookie properly
        response.cookies.set("session", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: new Date(0),
            maxAge: 0
        });

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { message: "Failed to logout" },
            { status: 500 }
        );
    }
}