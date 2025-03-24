import { NextRequest, NextResponse } from 'next/server';
import connectDB from "../../../db/dbConnect";
import Restaurant from "../../../models/Restaurant";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export async function GET() {
  try {
    console.log("Connecting to database...");
    await connectDB();
    const restaurants = await Restaurant.find();
    //console.log("Fetched restaurants:", restaurants);
    return NextResponse.json(restaurants);
  } catch (err) {
    return NextResponse.json({ error: "Error fetching restaurants" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    
    const body = await request.json();
    const { 
      name, 
      address, 
      phone, 
      open_time, 
      close_time, 
      history, 
      picture, 
      discount_month 
    } = body;
    
    if (!name || !address || !phone || !open_time || !close_time || !history || !picture || !discount_month) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    await connectDB();
    const newRestaurant = new Restaurant({
      name,
      address,
      phone,
      open_time,
      close_time,
      history,
      picture,
      discount_month
    });
    
    await newRestaurant.save();
    return NextResponse.json(newRestaurant);
  } catch (err) {
    console.error("Error creating restaurant:", err);
    return NextResponse.json({ error: "Error creating restaurant" }, { status: 500 });
  }
}