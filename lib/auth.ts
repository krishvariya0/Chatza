import { connectToDatabase } from "@/lib/mongoose";
import Session from "@/models/Session";
import User from "@/models/User";
import { cookies } from "next/headers";

export async function createSession(userId: string) {
    await connectToDatabase();

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await Session.create({
        userId,
        token,
        expiresAt,
    });

    return token;
}

export async function getSession() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session")?.value;

        if (!token) {
            return null;
        }

        await connectToDatabase();

        const session = await Session.findOne({
            token,
            expiresAt: { $gt: new Date() },
        }).populate("userId");

        if (!session) {
            return null;
        }

        return {
            userId: session.userId._id.toString(),
            user: session.userId,
        };
    } catch (error) {
        console.error("Get session error:", error);
        return null;
    }
}

export async function deleteSession(token: string) {
    await connectToDatabase();
    await Session.deleteOne({ token });
}

export async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;

    await connectToDatabase();
    const user = await User.findById(session.userId).select("-password");
    return user;
}
