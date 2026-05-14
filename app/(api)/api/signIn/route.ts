import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/db.connect";
import User from "@/app/Model/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 1. Find the user in the database
    const user = await User.findOne({
      $or: [{ email: email }, { Username: email }],
    });

    if (!user) {
      return NextResponse.json(
        { message: "No user found with this email" },
        { status: 404 }
      );
    }

    // 2. Check if the password matches
    const isPasswordCorrect = await bcrypt.compare(password, user.Password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    }

    // 3. Return success (Note: This does not set NextAuth cookies!)
    return NextResponse.json(
      { 
        message: "Login successful!", 
        user: { id: user._id, email: user.email, name: user.Username } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("SignIn error:", error);
    return NextResponse.json(
      { message: "An error occurred during sign in" },
      { status: 500 }
    );
  }
}