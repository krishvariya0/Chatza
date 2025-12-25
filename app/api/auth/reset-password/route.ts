import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        console.log("🔐 RESET PASSWORD TOKEN", token);

        if (!token || !password) {
            return NextResponse.json(
                { success: false, message: "Token and password required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // 🔐 HASH TOKEN FROM URL
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        console.log(" 🔐 RESET PASSWORD hashedToken", hashedToken);

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
        });


        console.log("user??????", user);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired reset link" },
                { status: 400 }
            );
        }

        // ✅ UPDATE PASSWORD
        user.password = await bcrypt.hash(password, 10);

        // ✅ CLEAR RESET TOKEN
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        console.log("user.resetPasswordExpires", user.resetPasswordExpires);

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password reset successful",
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Something went wrong" },
            { status: 500 }
        );
    }
}
