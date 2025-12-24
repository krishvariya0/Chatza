import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   // Logic to fetch data from a database or external service
//   const users = [
//     { id: 1, name: 'Alice' },
//     { id: 2, name: 'Bob' },
//   ];

//   // Return a JSON response
//   return NextResponse.json(users, { status: 200 });
// }

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

    await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { success: true, message: "User registered successfully" },
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

