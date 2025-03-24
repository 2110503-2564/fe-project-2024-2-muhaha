import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../db/dbConnect";
import { ObjectId } from "mongodb";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
    }
    
    let reservationId;
    try {
      reservationId = new ObjectId(id);
    } catch (err) {
      console.error("Invalid ObjectId format:", err);
      return NextResponse.json({ error: "Invalid reservation ID format" }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    if (!db) {
      console.error("Failed to connect to database");
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
    
    const reservation = await db.collection("reservations").findOne({ _id: reservationId });
    
    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }
    
    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return NextResponse.json({ error: "Failed to fetch reservation" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
    }
    
    let reservationId;
    try {
      reservationId = new ObjectId(id);
    } catch (err) {
      console.error("Invalid ObjectId format:", err);
      return NextResponse.json({ error: "Invalid reservation ID format" }, { status: 400 });
    }
    
    const body = await request.json();
    const { userId, restaurantId, reservationDate, people } = body;
    
    if (!userId || !restaurantId || !reservationDate || !people) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
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
    
    const existingReservation = await db.collection("reservations").findOne({ _id: reservationId });
    
    if (!existingReservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }
    
    const restaurant = await db.collection("restaurants").findOne({ _id: restaurantObjectId });
    
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }
    
    const updateData = {
      userId: userObjectId,
      restaurantId: restaurantObjectId,
      restaurantName: restaurant.name,
      restaurantPicture: restaurant.picture,
      reservationDate,
      people,
      discount: existingReservation.discount,
      updatedAt: new Date(),
    };
    
    await db.collection("reservations").updateOne(
      { _id: reservationId },
      { $set: updateData }
    );
    
    return NextResponse.json({
      ...updateData,
      _id: reservationId,
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json({ error: "Failed to update reservation"}, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
    }
    
    let reservationId;
    try {
      reservationId = new ObjectId(id);
    } catch (err) {
      console.error("Invalid ObjectId format:", err);
      return NextResponse.json({ error: "Invalid reservation ID format" }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    if (!db) {
      console.error("Failed to connect to database");
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
    
    const result = await db.collection("reservations").deleteOne({ _id: reservationId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json({ error: "Failed to delete reservation" }, { status: 500 });
  }
}