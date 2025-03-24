"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReservationCard from "@/components/ReservationCard";

interface Reservation {
  _id: string;
  restaurantName: string;
  reservationDate: string;
  restaurantPicture: string;
  discount: string;
  people: number;
  userName: string;
}

export default function AdminReservations() {
  const { data: session } = useSession();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is admin
    if (session?.user?.role !== "admin") {
      router.push("/homepage");
      return;
    }

    const fetchReservations = async () => {
      try {
        const res = await fetch("/api/reservations");
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        
        const data = await res.json();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setError("Failed to load reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [session, router]);

  if (loading) {
    return <div className="p-6 mx-10 my-6">Loading reservations...</div>;
  }

  if (error) {
    return <div className="p-6 mx-10 my-6">Error: {error}</div>;
  }

  return (
    <div className="p-6 mx-10 my-6">
      <h1 className="text-3xl font-semibold mb-8 text-[#543822]">All Reservations</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reservations.length === 0 ? (
          <p className="text-gray-500 my-10">No reservations found.</p>
        ) : (
          reservations.map((reservation) => (
            <ReservationCard
              key={reservation._id}
              id={reservation._id}
              name={reservation.restaurantName}
              reservationDate={reservation.reservationDate}
              restaurantName={reservation.restaurantName}
              restaurantPicture={reservation.restaurantPicture}
              discount={reservation.discount}
              people={reservation.people}
              userName={reservation.userName}
              isAdmin={true}
            />
          ))
        )}
      </div>
    </div>
  );
}