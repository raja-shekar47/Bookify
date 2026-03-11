import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  // Form
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/reviews");
      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  }, [setReviews]); // setReviews is stable, but including it is harmless

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]); // fetchReviews is now a dependency

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/reviews", {
        name,
        rating,
        comment,
      });
      alert("Review submitted for approval!");
      setName("");
      setComment("");
    } catch (error) {
      console.error(error);
      alert("Failed to submit review");
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Guest Experiences</h1>

      <div className="responsive-grid">
        {/* List */}
        <div>
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div
                key={r._id}
                style={{
                  marginBottom: "2rem",
                  background: "white",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h4 style={{ fontSize: "1.1rem" }}>{r.name}</h4>
                  <div style={{ color: "#f1c40f" }}>
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        color={i < r.rating ? "#f1c40f" : "#ddd"}
                      />
                    ))}
                  </div>
                </div>
                <p
                  style={{
                    marginTop: "0.5rem",
                    color: "#555",
                    fontStyle: "italic",
                  }}
                >
                  "{r.comment}"
                </p>
              </div>
            ))
          )}
        </div>

        {/* Form */}
        <div
          className="card"
          style={{ padding: "2rem", height: "fit-content" }}
        >
          <h3 style={{ marginBottom: "1.5rem" }}>Share Your Stay</h3>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
              required
            />

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontSize: "0.9rem",
                }}
              >
                Rating
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                style={{ padding: "10px", width: "100%" }}
              >
                <option value="5">5 Stars - Excellent</option>
                <option value="4">4 Stars - Good</option>
                <option value="3">3 Stars - Average</option>
                <option value="2">2 Stars - Poor</option>
                <option value="1">1 Star - Terrible</option>
              </select>
            </div>

            <textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="5"
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
              required
            ></textarea>

            <button className="btn" type="submit">
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
