import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/** Origin the backend serves uploaded files from, e.g. http://localhost:5000 */
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export const TOKEN_KEY = "aaron-stays:token";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the saved token to every request.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// A rejected token means the session is gone — clear it and let the app
// bounce the user to the sign-in screen.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event("aaron-stays:signed-out"));
    }
    return Promise.reject(error);
  },
);

/**
 * Turns a stored image value into something an <img> can load.
 * - "/uploads/x.jpg"      → served by the backend, needs its origin
 * - "/images/rooms/x.jpg" → lives in the frontend's public folder
 * - "https://…"           → used as-is
 */
export const resolveImageUrl = (value) => {
  if (!value) return "";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (value.startsWith("/uploads/")) return `${API_ORIGIN}${value}`;
  return value;
};

/** Pulls a readable message out of an axios error. */
export const getErrorMessage = (error, fallback = "Something went wrong.") =>
  error?.response?.data?.message || error?.message || fallback;

export default API;
