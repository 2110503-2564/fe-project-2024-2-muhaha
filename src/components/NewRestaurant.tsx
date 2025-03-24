// src/components/NewRestaurant.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const NewRestaurant = () => {
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
  const [error, setError] = useState("");

  if (session?.user?.role !== "admin") {
    router.push("/homepage");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.phone || !formData.open_time || 
        !formData.close_time || !formData.history || !formData.picture) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch("/api/restaurants/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/homepage");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create restaurant");
      }
    } catch (error) {
      console.error("Error creating restaurant:", error);
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

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="p-6 mx-10 my-6">
      <h1 className="text-3xl font-semibold mb-8 text-[#543822]">Add New Restaurant</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
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
        
        <button
          type="submit"
          disabled={loading}
          className="bg-[#DD8827] text-white px-6 py-3 rounded-full text-lg font-medium"
          onMouseOver={(e) => onOrangeMouseAction(e)}
          onMouseOut={(e) => onOrangeMouseAction(e)}
        >
          {loading ? "Creating Restaurant..." : "Add Restaurant"}
        </button>
      </form>
    </div>
  );
};

export default NewRestaurant;

















































































































