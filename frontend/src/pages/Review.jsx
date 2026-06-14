import { useEffect, useState } from "react";
import axios from "axios";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         "https://jsonplaceholder.typicode.com/comments?_limit=10",
  //       );

  //       const formattedReviews = data.map((item) => ({
  //         id: item.id,
  //         comment: item.body,
  //         name: item.name,
  //         email: item.email,
  //       }));

  //       setReviews(formattedReviews);
  //     } catch (err) {
  //       setError(err.message || "Failed to load reviews.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchReviews();
  // }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(
          "https://jsonplaceholder.typicode.com/comments?_limit=10",
        );

        const formattedReviews = data.map((item) => {
          return {
            id: item.id,
            comment: item.body,
            name: item.name,
            email: item.email,
          };
        });
        setReviews(formattedReviews);
      } catch (err) {
        setError(err.message || "Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading reviews...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="mb-8 text-3xl font-bold text-gray-800">
        Customer Reviews
      </h2>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl bg-white p-6 shadow-sm border"
          >
            <p className="mb-4 text-gray-700">{review.comment}</p>

            <div>
              <p className="font-medium text-gray-900">{review.name}</p>
              <p className="text-sm text-gray-500">{review.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
