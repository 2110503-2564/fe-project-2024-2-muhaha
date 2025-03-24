"use client"

import { useEffect, useState } from "react";
import PhoneIcon from '@mui/icons-material/Phone';
import Image from "next/image";

interface HistoryProps {
    id: string;
}

export default function History({ id }: HistoryProps) {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [status, setStatus] = useState<string>("Closed");
  const [statusColor, setStatusColor] = useState<string>("bg-red-500");

  useEffect(() => {
    if (id) {
      const fetchRestaurantData = async () => {
        try {
          const res = await fetch(`/api/restaurants/${id}`);
          const data = await res.json();
          setRestaurant(data);
          
          // Parse time with AM/PM format
          const parseTimeToMinutes = (timeString: string) => {
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
          
          const now = new Date();
          const currentHours = now.getHours();
          const currentMinutes = now.getMinutes();
          const currentTime = currentHours * 60 + currentMinutes;
          
          const openTime = parseTimeToMinutes(data.open_time);
          const closeTime = parseTimeToMinutes(data.close_time);
          
          // console.log("Current time (mins):", currentTime);
          // console.log("Open time (mins):", openTime);
          // console.log("Close time (mins):", closeTime);
          
          if (currentTime >= openTime && currentTime <= closeTime) {
            setStatus("Open");
            setStatusColor("bg-green-500");
          } else {
            setStatus("Closed");
            setStatusColor("bg-red-500");
          }
        } catch (error) {
          console.error("Error fetching restaurant data", error);
        }
      };
      fetchRestaurantData();
    }
  }, [id]);

  if (!restaurant) {
    return <p>Loading...</p>;
  }

  return (
    <div>
        <div className="relative w-full h-[70vh] overflow-hidden mb-4">
            <Image
                src={restaurant.picture}
                alt={restaurant.name}
                layout="fill"
                objectFit="cover"
            />
        </div>
        <div className="p-6 mx-10 my-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold text-[#543822]">{restaurant.name}</h1>
            </div>
            <div className="flex items-center text-lg font-semibold mt-4">
                <div className={`text-white text-xs px-2 py-1 rounded-lg ${statusColor}`} style={{ marginRight: '10px' }}>
                {status}
                </div>
                <p>{restaurant.open_time} - {restaurant.close_time}</p>
                <div className="flex items-center text-sm text-gray-500 ml-6">
                    <PhoneIcon style={{ marginRight: '5px' }} />
                    {restaurant.phone}
                </div>
            </div>
            <div className="mt-6">
                <h2 className="text-xl font-semibold text-[#543822] mb-4">History</h2>
                <p className="text-justify">{restaurant.history}</p>
            </div>
      </div>
    </div>
  );
}




















































































































