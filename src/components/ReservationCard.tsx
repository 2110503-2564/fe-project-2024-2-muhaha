import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { Edit, Person } from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface ReservationCardProps {
  id: string;
  name: string;
  reservationDate: string;
  restaurantName: string;
  discount: string;
  restaurantPicture: string;
  people: number;
  userName?: string;
  isAdmin?: boolean;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  id,
  name,
  reservationDate,
  restaurantName,
  discount,
  restaurantPicture,
  people,
  userName,
  isAdmin = false,
}) => {
  const router = useRouter();
  
  const formattedDate = () => {
    try {
      const date = new Date(reservationDate);
      return format(date, "d MMMM yyyy", { locale: enGB });
    } catch (error) {
      return reservationDate;
    }
  };
  
  const handleEdit = () => {
    router.push(`/edit-reservation/${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mb-6 relative">
      <button 
        onClick={handleEdit}
        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md z-10"
      >
        <Edit className="text-[#543822]" />
      </button>
      
      <div className="relative h-52 w-full">
        <Image
          src={restaurantPicture}
          alt={restaurantName}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-[#543822]">{restaurantName}</h3>
          {discount !== "0%" && (
            <span className="bg-[#971C1C] text-white py-1 px-2 text-xs ">
              discount {discount}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <h3 className="bg-[#E63946] text-white py-1 px-3 rounded-full text-xs">reservation date</h3>
          <span className="text-sm font-semibold underline mr-[30%]">
            {formattedDate()}
          </span>
        </div>
        <div className="mt-2">
          <span className="text-sm text-gray-600">People: {people}</span>
        </div>
        {isAdmin && userName && (
          <div className="mt-2 flex items-center">
            <Person className="text-gray-500 mr-1" fontSize="small" />
            <span className="text-sm text-gray-600 font-medium">Reserved by: {userName}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationCard;