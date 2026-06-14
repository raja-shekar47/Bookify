import { useState } from "react";
import BookingSearch from "../features/booking/BookingSearch";
import RoomList from "../features/rooms/RoomList";

const Home = () => {
  const [searchData, setSearchData] = useState();
  const handleSearch = (data) => {
    setSearchData(data);
  };

  return (
    <>
      <BookingSearch
        buttonLabel="Search"
        defaultValues={searchData}
        onSearch={handleSearch}
      />
      <RoomList />;
    </>
  );
};

export default Home;
