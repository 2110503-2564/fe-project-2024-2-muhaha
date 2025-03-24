import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../db/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/authOptions";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    
    const { db } = await connectToDatabase();
    
    if (!db) {
      console.error("Failed to connect to database");
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
    const users = await db.collection("users")
      .find({})
      .project({ name: 1, email: 1, birthday: 1 })
      .sort({ name: 1 })
      .toArray();
    
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}