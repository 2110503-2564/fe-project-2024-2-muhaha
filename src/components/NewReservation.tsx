"use client";

import React, { useState, useEffect, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { TextField, MenuItem, Button, Box, Typography, Paper, Alert } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface Restaurant {
  _id: string;
  name: string;
  discount_month?: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  birthday?: string;
}

interface FormData {
  userId: string;
  restaurantId: string;
  date: Date;
  people: number;
}

interface CustomUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  birthday?: string;
}

interface CustomSession {
  user?: CustomUser;
  expires?: string;
}

const NewReservation = () => {
  const router = useRouter();
  const { data: session } = useSession() as { data: CustomSession | null };
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<FormData>({
    userId: "",
    restaurantId: "",
    date: new Date(),
    people: 1,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [birthdayDiscount, setBirthdayDiscount] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch("/api/restaurants/");
        const data = await res.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    const fetchUsers = async () => {
      if (isAdmin) {
        try {
          const res = await fetch("/api/auth/users");
          const data = await res.json();
          setUsers(data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }
    };

    fetchRestaurants();
    fetchUsers();

    // Set default userId to current user if not admin
    if (!isAdmin && session?.user?.id) {
      setFormData(prev => ({
        ...prev,
        userId: session.user?.id || ""
      }));
    }
  }, [isAdmin, session?.user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "restaurantId") {
      const selected = restaurants.find(r => r._id === value);
      setSelectedRestaurant(selected || null);
    }

    if (name === "userId") {
      const selected = users.find(u => u._id === value);
      setSelectedUser(selected || null);
    }
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setFormData({
        ...formData,
        date: newDate,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.restaurantId || !formData.date || formData.people < 1 || formData.people > 15) {
      return;
    }

    // Ensure there's a userId (either from form for admin or from session for regular users)
    const userId = isAdmin ? formData.userId : session?.user?.id;
    
    if (!userId) {
      alert("User selection is required");
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch("/api/reservations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          restaurantId: formData.restaurantId,
          reservationDate: formData.date.toISOString(),
          people: formData.people,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        
        // Check for birthday discount
        const birthdayToCheck = isAdmin ? selectedUser?.birthday : session?.user?.birthday;
        
        if (birthdayToCheck) {
          const userBirthMonth = new Date(birthdayToCheck).getMonth() + 1;
          if (selectedRestaurant && userBirthMonth === selectedRestaurant.discount_month) {
            setBirthdayDiscount(true);
            setTimeout(() => {
              router.push("/homepage");
            }, 3000);
          } else {
            setTimeout(() => {
              router.push("/homepage");
            }, 1500);
          }
        } else {
          setTimeout(() => {
            router.push("/homepage");
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
    } finally {
      setLoading(false);
    }
  };

  function onOrangeMouseAction(event: SyntheticEvent) {
    if (event.type === "mouseover") {
      event.currentTarget.classList.remove("bg-[#DD8827]");
      event.currentTarget.classList.add("bg-[#AC6A1F]");
    } else {
      event.currentTarget.classList.remove("bg-[#AC6A1F]");
      event.currentTarget.classList.add("bg-[#DD8827]");
    }
  }

  return (
    <div className="p-6 mx-10 my-6">
      <h1 className="text-3xl font-semibold mb-8 text-[#543822]">Make a Reservation</h1>
      
      {birthdayDiscount && (
        <Paper className="p-4 mb-6 bg-[#f8f4e3] border border-[#DD8827]">
          <Typography variant="h6" className="text-[#543822] font-semibold">
            🎉 Birthday Month Special! 🎉
          </Typography>
          <Typography className="text-[#543822]">
            We noticed it's your birthday month! You've received a special 15% discount on your reservation.
          </Typography>
        </Paper>
      )}
      
      {success && !birthdayDiscount && (
        <Alert severity="success" className="mb-6">
          Reservation created successfully! Redirecting to homepage...
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        {isAdmin && (
          <div className="mb-6">
            <label className="block text-[#543822] text-lg mb-2">User</label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD8827]"
              required
            >
              <option value="" disabled>Choose Users</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-[#543822] text-lg mb-2">Restaurant</label>
          <select
            name="restaurantId"
            value={formData.restaurantId}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD8827]"
            required
          >
            <option value="" disabled>Choose Restaurants</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-[#543822] text-lg mb-2">Reservation Date</label>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              value={formData.date}
              onChange={handleDateChange}
              slotProps={{ 
                textField: { 
                  fullWidth: true,
                  required: true,
                  placeholder: "Select Date"
                } 
              }}
            />
          </LocalizationProvider>
        </div>
        
        <div className="mb-8">
          <label className="block text-[#543822] text-lg mb-2">People</label>
          <input
            type="number"
            name="people"
            value={formData.people}
            onChange={handleChange}
            min="1"
            max="15"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD8827]"
            required
          />
          <p className="text-sm text-gray-500 mt-1">Between 1 and 15 people</p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-[#DD8827] text-white px-6 py-3 rounded-full text-lg font-medium"
          onMouseOver={(e) => onOrangeMouseAction(e)}
          onMouseOut={(e) => onOrangeMouseAction(e)}
        >
          {loading ? "Creating Reservation..." : "Confirm"}
        </button>
      </form>
    </div>
  );
};

export default NewReservation;