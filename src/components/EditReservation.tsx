"use client";

import React, { useState, useEffect, ChangeEvent, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

interface EditReservationProps {
  reservationId: string;
}

// Define the interface for restaurant data
interface Restaurant {
  _id: string;
  name: string;
  picture: string;
  address: string;
  open_time: string;
  close_time: string;
  phone: string;
  discount_month?: number;
}

// Define the interface for user data
interface User {
  _id: string;
  name: string;
  email: string;
  birthday?: string;
}

// Define the interface for reservation data
interface ReservationData {
  _id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantPicture: string;
  reservationDate: string;
  people: number;
  discount: string;
  createdAt: string;
  updatedAt?: string;
}

const EditReservation: React.FC<EditReservationProps> = ({ reservationId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    userId: "",
    restaurantId: "",
    date: new Date(),
    people: 1,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [originalData, setOriginalData] = useState<ReservationData | null>(null);
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resRest = await fetch("/api/restaurants/");
        const restaurantData = await resRest.json() as Restaurant[];
        setRestaurants(restaurantData);

        if (isAdmin) {
          try {
            const resUsers = await fetch("/api/auth/users");
            const userData = await resUsers.json() as User[];
            setUsers(userData);
          } catch (error) {
            console.error("Error fetching users:", error);
          }
        }
        
        const resReservation = await fetch(`/api/reservations/${reservationId}`);
        if (!resReservation.ok) {
          throw new Error(`Failed to fetch reservation: ${resReservation.status}`);
        }
        
        const reservationData = await resReservation.json() as ReservationData;
        setOriginalData(reservationData);
        
        setFormData({
          userId: reservationData.userId,
          restaurantId: reservationData.restaurantId,
          date: new Date(reservationData.reservationDate),
          people: reservationData.people,
        });
        
        const selected = restaurantData.find(r => r._id === reservationData.restaurantId);
        if (selected) {
          setSelectedRestaurant(selected);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load reservation data");
      }
    };

    if (reservationId) {
      fetchData();
    }
  }, [reservationId, isAdmin]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "restaurantId") {
      const selected = restaurants.find(r => r._id === value);
      if (selected) {
        setSelectedRestaurant(selected);
      }
    }

    if (name === "userId") {
      const selected = users.find(u => u._id === value);
      if (selected) {
        setSelectedUser(selected);
      }
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.restaurantId || !formData.date || formData.people < 1 || formData.people > 15) {
      setError("Please fill all required fields correctly");
      return;
    }

    // For admin, use the selected user's ID, otherwise use the current user's ID
    const userId = isAdmin ? formData.userId : (session?.user as any)?.id;
    
    if (!userId) {
      setError("User selection is required");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`/api/reservations/${reservationId}`, {
        method: "PUT",
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
        setTimeout(() => {
          router.push("/homepage");
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update reservation");
      }
    } catch (error) {
      console.error("Error updating reservation:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      const res = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setShowDeleteConfirm(false);
        setSuccess(true);
        setTimeout(() => {
          router.push("/homepage");
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete reservation");
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  function onOrangeMouseAction(event: React.SyntheticEvent) {
    if (event.type === "mouseover") {
      event.currentTarget.classList.remove("bg-[#DD8827]");
      event.currentTarget.classList.add("bg-[#AC6A1F]");
    } else {
      event.currentTarget.classList.remove("bg-[#AC6A1F]");
      event.currentTarget.classList.add("bg-[#DD8827]");
    }
  }
  
  function onRedMouseAction(event: React.SyntheticEvent) {
    if (event.type === "mouseover") {
      event.currentTarget.classList.remove("bg-[#E63946]");
      event.currentTarget.classList.add("bg-[#C8303B]");
    } else {
      event.currentTarget.classList.remove("bg-[#C8303B]");
      event.currentTarget.classList.add("bg-[#E63946]");
    }
  }

  if (!originalData && !error) {
    return <div className="p-6 mx-10 my-6">Loading reservation data...</div>;
  }

  if (error && !originalData) {
    return <div className="p-6 mx-10 my-6">Error: {error}</div>;
  }

  return (
    <div className="p-6 mx-10 my-6">
      <h1 className="text-3xl font-semibold mb-8 text-[#543822]">Edit Reservation</h1>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Reservation updated successfully! Redirecting to homepage...
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleUpdate}>
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
          <label className="block text-[#543822] text-lg mb-2">Choose Restaurant</label>
          <select
            name="restaurantId"
            value={formData.restaurantId}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD8827]"
            required
          >
            <option value="" disabled>Select a restaurant</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-[#543822] text-lg mb-2">Choose Date & Time</label>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              value={formData.date}
              onChange={handleDateChange}
              slotProps={{ 
                textField: { 
                  fullWidth: true,
                  required: true 
                } 
              }}
            />
          </LocalizationProvider>
        </div>
        
        <div className="mb-8">
          <label className="block text-[#543822] text-lg mb-2">Number of People</label>
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
        
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#DD8827] text-white px-6 py-3 rounded-full text-lg font-medium"
            onMouseOver={(e) => onOrangeMouseAction(e)}
            onMouseOut={(e) => onOrangeMouseAction(e)}
          >
            {loading ? "Updating..." : "Confirm Changes"}
          </button>
          
          <button
            type="button"
            disabled={loading}
            className="bg-[#E63946] text-white px-6 py-3 rounded-full text-lg font-medium"
            onClick={() => setShowDeleteConfirm(true)}
            onMouseOver={(e) => onRedMouseAction(e)}
            onMouseOut={(e) => onRedMouseAction(e)}
          >
            Delete Reservation
          </button>
        </div>
      </form>
      
      <Dialog 
            open={showDeleteConfirm} 
            onClose={() => setShowDeleteConfirm(false)}
            PaperProps={{
                style: {
                borderRadius: '16px',
                padding: '12px'
                }
            }}
            >
            <DialogTitle className="text-center text-2xl font-bold text-black">
                Are you sure to remove your reservation?
            </DialogTitle>
            <DialogContent>
                <div className="relative">
                <div className="flex justify-center mt-6 mb-6">
                    <button
                    onClick={handleDelete}
                    className="bg-[#DD8827] text-white px-6 py-2 rounded-full text-lg font-medium"
                    onMouseOver={(e) => onOrangeMouseAction(e)}
                    onMouseOut={(e) => onOrangeMouseAction(e)}
                    >
                    Confirm
                    </button>
                </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
};

export default EditReservation;