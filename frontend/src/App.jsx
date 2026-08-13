import "./App.css";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Rooms from "./pages/Rooms.jsx";
import RoomDetails from "./pages/RoomDetails.jsx";
import Transport from "./pages/Transports.jsx";
import Reviews from "./pages/Review.jsx";
import Contact from "./pages/Contact.jsx";
import BookingStatus from "./pages/BookingStatus.jsx";
import NotFound from "./pages/NotFound.jsx";
import Admin from "./pages/Admin.jsx";

function App() {
  return (
    <Routes>
      {/* Admin console — standalone, no guest chrome */}
      <Route path="/admin" element={<Admin />} />

      {/* Public site */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="rooms/:roomId" element={<RoomDetails />} />
        <Route path="transport" element={<Transport />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="contact" element={<Contact />} />
        <Route path="booking-status" element={<BookingStatus />} />
        <Route path="booking/:reference" element={<BookingStatus />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
