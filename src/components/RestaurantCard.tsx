"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import PhoneIcon from "@mui/icons-material/Phone";
import { Edit } from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface RestaurantCardProps {
  name: string;
  address: string;
  open_time: string;
  close_time: string;
  phone: string;
  picture: string;
  id: string;
  isAdmin?: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  name,
  address,
  open_time,
  close_time,
  phone,
  picture,
  id,
  isAdmin = false,
}) => {
  const router = useRouter();
  const [status, setStatus] = useState<string>("Closed");
  const [statusColor, setStatusColor] = useState<string>("bg-red-500");

  useEffect(() => {
    const checkRestaurantStatus = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTime = currentHours * 60 + currentMinutes;
      
      const parseTimeToMinutes = (timeString:string) => {
        // Extract hours, minutes, and period (AM/PM)
        const timeParts = timeString.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (!timeParts) return 0;
        
        let hours = parseInt(timeParts[1]);
        const minutes = parseInt(timeParts[2]);
        const period = timeParts[3]?.toUpperCase();
        
        // Adjust hours for PM
        if (period === 'PM' && hours < 12) hours += 12;
        // Adjust for 12 AM
        if (period === 'AM' && hours === 12) hours = 0;
        
        return hours * 60 + minutes;
      };
      
      const openTime = parseTimeToMinutes(open_time);
      const closeTime = parseTimeToMinutes(close_time);
      
      if (currentTime >= openTime && currentTime <= closeTime) {
        setStatus("Open");
        setStatusColor("bg-green-500");
      } else {
        setStatus("Closed");
        setStatusColor("bg-red-500");
      }
    };

    checkRestaurantStatus();
  }, [open_time, close_time]);

  const handleClick = () => {
    router.push(`/history/${id}`);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/edit-restaurant/${id}`);
  };

  function onWhiteMouseAction(event: React.SyntheticEvent) {
    if (event.type === "mouseover") {
      event.currentTarget.classList.remove("bg-white");
      event.currentTarget.classList.add("bg-[#D9D9D9]");
    } else {
      event.currentTarget.classList.remove("bg-[#D9D9D9]");
      event.currentTarget.classList.add("bg-white");
    }
  }

  return (
    <div
      className="flex flex-col max-w-xs p-1 border rounded-lg shadow-lg mt-4 relative"
      onMouseOver={(e) => onWhiteMouseAction(e)}
      onMouseOut={(e) => onWhiteMouseAction(e)}
      onClick={handleClick}
    >
      {isAdmin && (
        <button 
          onClick={handleEdit}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md z-10"
        >
          <Edit className="text-[#543822]" />
        </button>
      )}
      <Image
        src={picture}
        alt={name}
        width={500}
        height={300}
        className="object-cover h-48 w-full rounded-lg"
      />
      <div className="p-4">
        <div className="flex justify-between items-center mt-3">
          <h3 className="text-lg text-gray-700">{name}</h3>
          <a href="#details" className="text-xs text-gray-500 underline">
            See Details
          </a>
        </div>
        <p className="text-sm text-gray-500 mt-5">{address}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-lg font-semibold">
            {open_time} - {close_time}
          </p>
          <div
            className={`text-white text-xs px-2 py-1 rounded-lg ${statusColor}`}
          >
            {status}
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-5">
          <PhoneIcon style={{ marginRight: "5px" }} />
          {phone}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
