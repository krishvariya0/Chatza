// import { connectToDatabase } from "@/lib/mongoose";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { fullName, username, email, password } = await req.json();

//     if (!fullName || !username || !email || !password) {
//       return NextResponse.json(
//         { success: false, message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     const existingUser = await User.findOne({
//       $or: [{ email }, { username }],
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { success: false, message: "User already exists" },
//         { status: 409 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const user = await User.create({
//       fullName,
//       username,
//       email,
//       password: hashedPassword,
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "User registered successfully",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
