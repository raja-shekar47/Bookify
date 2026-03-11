import { useEffect, useState } from "react";
import axios from "axios";
import { FaCar } from "react-icons/fa";

const Transport = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/transport");
        setVehicles(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1 className="heading">Luxury Transport</h1>
      <p style={{ marginBottom: "2rem", color: "#666" }}>
        Explore Ooty in style. Contact us to book your ride.
      </p>

      <div className="responsive-grid">
        {vehicles.map((v) => (
          <div key={v._id} className="card">
            <div style={{ height: "200px", background: "#ccc" }}>
              <img
                src={v.image}
                alt={v.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ padding: "1.5rem" }}>
              <h3>{v.name}</h3>
              <p
                style={{
                  color: "var(--primary)",
                  fontWeight: "bold",
                  margin: "0.5rem 0",
                }}
              >
                ₹{v.pricePerDay} / day
              </p>

              <a href={`tel:${v.contactNumber || "1234567890"}`}>
                <button
                  className="btn"
                  style={{
                    width: "100%",
                    marginTop: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FaCar /> Book Now
                </button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transport;
