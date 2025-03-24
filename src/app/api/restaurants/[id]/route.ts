// src/app/api/restaurants/[id]/route.ts (update)
import { NextRequest, NextResponse } from 'next/server';
import connectDB from "../../../../db/dbConnect";
import Restaurant from "../../../../models/Restaurant";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const restaurant = await Restaurant.findById(params.id);
    
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }
    
    return NextResponse.json(restaurant);
  } catch (err) {
    return NextResponse.json({ error: "Error fetching restaurant" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      params.id,
      {
        name,
        address,
        phone,
        open_time,
        close_time,
        history,
        picture,
        discount_month
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedRestaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedRestaurant);
  } catch (err) {
    console.error("Error updating restaurant:", err);
    return NextResponse.json({ error: "Error updating restaurant" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    
    await connectDB();
    const restaurant = await Restaurant.findById(params.id);
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }
    
    await Restaurant.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    console.error("Error deleting restaurant:", err);
    return NextResponse.json({ error: "Error deleting restaurant" }, { status: 500 });
  }
}