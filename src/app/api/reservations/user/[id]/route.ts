import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../db/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";

interface Reservation {
  userId: ObjectId;
  restaurantId: ObjectId;
  restaurantName: string;
  restaurantPicture: string;
  reservationDate: string;
  people: number;
  discount: string;
  createdAt: Date;
  _id: ObjectId;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.id !== userId && session.user.role !== 'admin')) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    
    let userObjectId;
    try {
      userObjectId = new ObjectId(userId);
    } catch (err) {
      console.error("Invalid ObjectId format:", err);
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    if (!db) {
      console.error("Failed to connect to database");
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    if (session.user.role === 'admin') {
      const user = await db.collection("users").findOne({ _id: userObjectId });
      const userName = user ? user.name : "Unknown";
      
      const reservations = await db.collection("reservations")
        .find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .toArray();
      
      const reservationsWithUserName = reservations.map((reservation: Reservation) => ({
        ...reservation,
        userName
      }));
      
      return NextResponse.json(reservationsWithUserName);
    } else {
      const reservations = await db.collection("reservations")
        .find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .toArray();
      
      return NextResponse.json(reservations);
    }
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    return NextResponse.json({ error: "Failed to fetch user reservations" }, { status: 500 });
  }
}