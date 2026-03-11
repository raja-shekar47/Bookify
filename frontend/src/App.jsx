import "./App.css";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import AddRoom from "./pages/Admin.jsx";

import axios from "axios";
import { useEffect } from "react";
import RoomDetails from "./pages/RoomDetails.jsx";

function App() {
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/test")
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Routes>
      {/* Admin */}
      <Route path="/admin" element={<AddRoom />} />

      {/* Public with layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/rooms/:roomId" element={<RoomDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
