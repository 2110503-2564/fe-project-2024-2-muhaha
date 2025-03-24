import EditReservation from "@/components/EditReservation";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditReservationPage({ params }: PageProps) {
  return <EditReservation reservationId={params.id} />;
}