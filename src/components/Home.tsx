"use client"

import { useState, useEffect, SyntheticEvent } from "react";
import ReservationCard from "./ReservationCard";
import RestaurantCard from "./RestaurantCard";
import { useSession } from "next-auth/react";
import { AddCircle } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  open_time: string;
  close_time: string;
  phone: string;
  picture: string;
  discount_month?: number;
}

interface Reservation {
  _id: string;
  restaurantName: string;
  reservationDate: string;
  restaurantPicture: string;
  discount: string;
  people: number;
  userName?: string;
}

interface CustomUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

interface CustomSession {
  user?: CustomUser;
  expires?: string;
}

const Home = () => {
  const { data: session } = useSession() as { data: CustomSession | null };
  const [userReservations, setUserReservations] = useState<Reservation[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const router = useRouter();
  const isAdmin = session?.user?.role === "admin";

  const handleNewReservation = () => {
    if (userReservations.length >= 3) {
      setShowMaxReservationsDialog(true);
    } else {
      router.push("/reservation");
    }
  };

  const handleNewRestaurant = () => {
    router.push("/new-restaurant");
  };

  const [showMaxReservationsDialog, setShowMaxReservationsDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/restaurants/");
        const restaurantData = await res.json();
        if (Array.isArray(restaurantData)) {
          setRestaurants(restaurantData as Restaurant[]);
        } else {
          console.error("Restaurant data is not an array:", restaurantData);
          setRestaurants([]);
        }
  
        if (session?.user?.id) {
          try {
            const reservationEndpoint = isAdmin 
              ? "/api/reservations/" 
              : `/api/reservations/user/${session.user.id}`;

            const reser = await fetch(reservationEndpoint);
            if (!reser.ok) {
              throw new Error(`API error: ${reser.status}`);
            }
            const reservationsData = await reser.json();
            //console.log("Received reservations:", reservationsData);
            
            if (Array.isArray(reservationsData)) {
              setUserReservations(reservationsData as Reservation[]);
            } else {
              console.error("Reservations data is not an array:", reservationsData);
              setUserReservations([]);
            }
          } catch (reservationError) {
            console.error("Error fetching reservations:", reservationError);
            setUserReservations([]);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setRestaurants([]);
        setUserReservations([]);
      }
    };
  
    fetchData();
  }, [session?.user?.id]);

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
    <div className="p-6 mx-10 my-6 mt-[5%]">
      <h1 className="text-3xl font-semibold mb-4 text-[#543822]">Hi, {session?.user?.name}</h1>
      <section>
        <section className="flex justify-start mb-2 my-10">
            <button className="bg-[#DD8827] text-white px-4 py-2 rounded-full flex items-center"
            onMouseOver={(e) => onOrangeMouseAction(e)}
            onMouseOut={(e) => onOrangeMouseAction(e)}
            onClick={handleNewReservation}>
            <AddCircle className="mr-2" fontSize="small" />
              New Reservation
            </button>
            {isAdmin && (
              <button className="bg-[#DD8827] text-white px-4 py-2 ml-[3%] rounded-full flex items-center"
                onMouseOver={(e) => onOrangeMouseAction(e)}
                onMouseOut={(e) => onOrangeMouseAction(e)}
                onClick={handleNewRestaurant}>
                <AddCircle className="mr-2" fontSize="small" />
                New Restaurant
              </button>
            )}
        </section>
        <h2 className="text-2xl mb-6 my-10">
          {isAdmin ? "All Reservations" : "Your Reservations"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userReservations.length === 0 ? (
            <p className="text-gray-500 my-10">You don't have any reservations.</p>
          ) : (
            userReservations.map((reservation) => (
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
                isAdmin={isAdmin}
              />
            ))
          )}
        </div>
      </section>
      <section className="mt-6">
        <h2 className="text-2xl mb-10">Explore Restaurants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant._id}
              id={restaurant._id}
              name={restaurant.name}
              address={restaurant.address}
              open_time={restaurant.open_time}
              close_time={restaurant.close_time}
              phone={restaurant.phone}
              picture={restaurant.picture}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </section>
      <Dialog 
        open={showMaxReservationsDialog} 
        onClose={() => setShowMaxReservationsDialog(false)}
        PaperProps={{
          style: {
            borderRadius: '16px',
            padding: '12px'
          }
        }}
      >
        <DialogTitle className="text-center text-2xl font-bold text-black">
          You can no longer make reservation. Please remove previous first.
        </DialogTitle>
        <DialogContent>
          <div className="relative">
            <div className="flex justify-center mt-6 mb-6">
              <button
                onClick={() => setShowMaxReservationsDialog(false)}
                className="bg-[#DD8827] text-white px-6 py-2 rounded-full text-lg font-medium"
                onMouseOver={(e) => onOrangeMouseAction(e)}
                onMouseOut={(e) => onOrangeMouseAction(e)}
              >
                Confirm
              </button>
            </div>
            <div className="absolute -bottom-12 left-0 right-0 bg-[#FFCC80] h-24 rounded-b-lg z-0" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;