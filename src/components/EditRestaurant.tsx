"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

interface EditRestaurantProps {
  restaurantId: string;
}

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  phone: string;
  open_time: string;
  close_time: string;
  history: string;
  picture: string;
  discount_month: number;
}

const EditRestaurant: React.FC<EditRestaurantProps> = ({ restaurantId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    open_time: "",
    close_time: "",
    history: "",
    picture: "",
    discount_month: 1,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [originalData, setOriginalData] = useState<Restaurant | null>(null);

  useEffect(() => {
    if (session?.user?.role !== "admin") {
      router.push("/homepage");
    }
  }, [session, router]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`/api/restaurants/${restaurantId}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch restaurant: ${res.status}`);
        }
        
        const restaurantData = await res.json() as Restaurant;
        setOriginalData(restaurantData);
        
        setFormData({
          name: restaurantData.name,
          address: restaurantData.address,
          phone: restaurantData.phone,
          open_time: restaurantData.open_time,
          close_time: restaurantData.close_time,
          history: restaurantData.history,
          picture: restaurantData.picture,
          discount_month: restaurantData.discount_month,
        });
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        setError("Failed to load restaurant data");
      }
    };

    if (restaurantId) {
      fetchRestaurant();
    }
  }, [restaurantId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.phone || !formData.open_time || 
        !formData.close_time || !formData.history || !formData.picture) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/homepage");
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update restaurant");
      }
    } catch (error) {
      console.error("Error updating restaurant:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}`, {
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
        setError(data.error || "Failed to delete restaurant");
      }
    } catch (error) {
      console.error("Error deleting restaurant:", error);
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

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  if (!originalData && !error) {
    return <div className="p-6 mx-10 my-6">Loading restaurant data...</div>;
  }

  if (error && !originalData) {
    return <div className="p-6 mx-10 my-6">Error: {error}</div>;
  }

  return (
    <div className="p-6 mx-10 my-6">
      <h1 className="text-3xl font-semibold mb-8 text-[#543822]">Edit Restaurant</h1>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Restaurant updated successfully! Redirecting to homepage...
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleUpdate}>
        <div className="mb-6">
          <label className="block text-[#543822] text-lg mb-2">Restaurant Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD8827]"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-[#543822] text-lg mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD8827]"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-[#543822] text-lg mb-2">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD8827]"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[#543822] text-lg mb-2">Opening Time</label>
            <input
              type="text"
              name="open_time"
              value={formData.open_time}
              onChange={handleChange}
              placeholder="e.g. 10:00 AM"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD8827]"
              required
            />
          </div>
          
          <div>
            <label className="block text-[#543822] text-lg mb-2">Closing Time</label>
            <input
              type="text"
              name="close_time"
              value={formData.close_time}
              onChange={handleChange}
              placeholder="e.g. 10:00 PM"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD8827]"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-[#543822] text-lg mb-2">Restaurant History</label>
          <textarea
            name="history"
            value={formData.history}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD8827]"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-[#543822] text-lg mb-2">Image URL</label>
          <input
            type="text"
            name="picture"
            value={formData.picture}
            onChange={handleChange}
            placeholder="Enter image URL"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD8827]"
            required
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-[#543822] text-lg mb-2">Discount Month</label>
          <select
            name="discount_month"
            value={formData.discount_month}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD8827]"
            required
          >
            {months.map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">Month when birthday discount applies</p>
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
            Delete Restaurant
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
          Are you sure you want to delete this restaurant?
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
                {loading ? "Deleting..." : "Confirm"}
              </button>
            </div>
            <div className="absolute -bottom-12 left-0 right-0 bg-[#FFCC80] h-24 rounded-b-lg z-0" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditRestaurant;