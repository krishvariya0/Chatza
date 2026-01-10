import { createSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Register route called");
    const { fullName, username, email, password } = await req.json();

    console.log("Received data:", { fullName, username, email, password });

    if (!fullName || !username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    // Create session
    const token = await createSession(newUser._id.toString());

    // Set cookies
    const cookieStore = await cookies();

    // Session cookie
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    // Onboarding status cookie (for middleware to read without DB query)
    cookieStore.set("onboarding_completed", newUser.onboardingCompleted ? "true" : "false", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          fullName: newUser.fullName,
          onboardingCompleted: newUser.onboardingCompleted,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Getting error in register route:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
