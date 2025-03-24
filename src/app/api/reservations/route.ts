import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../db/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    
    const { db } = await connectToDatabase();
    const reservations = await db.collection("reservations").aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $addFields: {
          userName: { $arrayElemAt: ["$user.name", 0] }
        }
      },
      {
        $project: {
          user: 0
        }
      }
    ]).toArray();
    
    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, restaurantId, reservationDate, people } = body;
    
    if (!userId || !restaurantId || !reservationDate || !people) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Add error handling for invalid ObjectIds
    let userObjectId, restaurantObjectId;
    try {
      userObjectId = new ObjectId(userId);
      restaurantObjectId = new ObjectId(restaurantId);
    } catch (err) {
      console.error("Invalid ObjectId format:", err);
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    if (!db) {
      console.error("Failed to connect to database");
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
    
    const restaurant = await db.collection("restaurants").findOne({ _id: restaurantObjectId });
    
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }
    
    const user = await db.collection("users").findOne({ _id: userObjectId });
    
    let discount = "0%";
    const possibleDiscounts = [5, 10, 15, 20, 25, 30];
    const randomDiscount = possibleDiscounts[Math.floor(Math.random() * possibleDiscounts.length)];
    
    if (user && user.birthday && restaurant && restaurant.discount_month) {
      const userBirthMonth = new Date(user.birthday).getMonth() + 1;
      if (userBirthMonth === restaurant.discount_month) {
        discount = `${randomDiscount}%`;
      }
    }
    
    const newReservation = {
      userId: userObjectId,
      restaurantId: restaurantObjectId,
      restaurantName: restaurant.name,
      restaurantPicture: restaurant.picture,
      reservationDate,
      people,
      discount,
      createdAt: new Date(),
    };
    
    const result = await db.collection("reservations").insertOne(newReservation);
    
    return NextResponse.json({
      ...newReservation,
      _id: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json({ error: "Failed to create reservation"}, { status: 500 });
  }
}