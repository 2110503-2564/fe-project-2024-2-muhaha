"use client"

import { useEffect, useState } from "react";
import History from "@/components/History"

export default function HistoryPage({ params }: { params: { id: string } }) {
  const [restaurant, setRestaurant] = useState<any>(null);
  const id = params.id;

  useEffect(() => {
    if (id) {
      const fetchRestaurantData = async () => {
        try {
          const res = await fetch(`/api/restaurants/${id}`);
          const data = await res.json();
          setRestaurant(data);
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
    <History id={params.id}></History>
  );
}