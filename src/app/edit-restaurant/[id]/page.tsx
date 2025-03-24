import EditRestaurant from "@/components/EditRestaurant";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditRestaurantPage({ params }: PageProps) {
  return <EditRestaurant restaurantId={params.id} />;
}