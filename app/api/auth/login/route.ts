import { createSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email/username and password are required",
          error: "VALIDATION_ERROR"
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No account found with this email or username",
          error: "INVALID_CREDENTIALS"
        },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect password. Please try again.",
          error: "INVALID_CREDENTIALS"
        },
        { status: 401 }
      );
    }

    // Create session
    const token = await createSession(user._id.toString());

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
    cookieStore.set("onboarding_completed", user.onboardingCompleted ? "true" : "false", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          onboardingCompleted: user.onboardingCompleted,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process login. Please try again later.",
        error: "SERVER_ERROR"
      },
      { status: 500 }
    );
  }
}

