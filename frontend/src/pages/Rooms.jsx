import BookingSearch from "../features/booking/BookingSearch";
import RoomList from "../features/rooms/RoomList";
import PageHeader from "../components/PageHeader";

const Rooms = () => (
  <div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
    <PageHeader
      eyebrow="Stays"
      title="Rooms & suites"
      description="Four units on one property — from a budget double to a family suite with its own living hall and kitchen."
    />

    <BookingSearch buttonLabel="Update search" />

    <RoomList respectSearch />
  </div>
);

export default Rooms;
