import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { name, email, password, role } = await req.json();

    const normalEmail = email.toLowerCase().trim();
    
    // Purana profile remove kar dete hain agar exist karta hai taake fresh hashing insert ho
    await User.deleteMany({ email: normalEmail });

    // Target Secure 12 rounds salting execution
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = await User.create({ 
      name, 
      email: normalEmail, 
      password: hashedPassword, 
      role: role || "customer" // Ya "admin" as per assignment tracking requirements
    });

    return NextResponse.json({ success: true, message: "Encrypted User Generated Safely!" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}