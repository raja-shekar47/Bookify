/**
 * Seeds Aaron Stays with the property's rooms and transport fleet.
 *
 * Usage:  npm run seed          (adds/updates, keeps bookings & reviews)
 *         npm run seed -- --fresh   (wipes rooms + transport first)
 */
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Room = require("./models/room");
const Transport = require("./models/transport");

const ADDRESS = "Aaron Stays, Ooty, The Nilgiris, Tamil Nadu 643001";

// Photos live in frontend/public/images/rooms/ and are served by the frontend.
const rooms = [
  {
    title: "Family Living Suite",
    image: "/images/rooms/family-living-suite.jpg",
    images: [
      "/images/rooms/family-living-suite.jpg",
      "/images/rooms/kitchen.jpg",
      "/images/rooms/standard-double.jpg",
    ],
    description:
      "Our largest unit — a bright hall with cushioned sofa seating and a traditional carpet, opening straight into the dining area and a fully fitted kitchen. Ideal for families and small groups who want their own space to sit together in the evenings.",
    type: "Family Suite",
    price: 3500,
    address: ADDRESS,
    maxGuests: 6,
    beds: 2,
    bathrooms: 2,
    amenities: [
      "Spacious living hall",
      "Sofa seating for 6",
      "Fully fitted kitchen",
      "Hot water 24/7",
      "Free WiFi",
      "Free parking",
      "Daily housekeeping",
    ],
    rating: 4.8,
    status: "available",
  },
  {
    title: "Deluxe Double Room",
    image: "/images/rooms/deluxe-double.jpg",
    images: ["/images/rooms/deluxe-double.jpg"],
    description:
      "A calm turquoise-toned room with a queen bed, fresh linen, a private sofa corner and two large windows that pull in the Nilgiri morning light. The quietest room on the property.",
    type: "Deluxe Room",
    price: 2500,
    address: ADDRESS,
    maxGuests: 3,
    beds: 1,
    bathrooms: 1,
    amenities: [
      "Queen bed",
      "Sofa seating",
      "Large windows with curtains",
      "Hot water 24/7",
      "Free WiFi",
      "Room service",
      "Free parking",
    ],
    rating: 4.7,
    status: "available",
  },
  {
    title: "Standard Double Room",
    image: "/images/rooms/standard-double.jpg",
    images: ["/images/rooms/standard-double.jpg", "/images/rooms/kitchen.jpg"],
    description:
      "A neat, budget-friendly double room with a wooden queen bed, an open shelf and direct access to the shared kitchen — perfect for couples or a short two-night stopover.",
    type: "Standard Room",
    price: 1800,
    address: ADDRESS,
    maxGuests: 2,
    beds: 1,
    bathrooms: 1,
    amenities: [
      "Queen bed",
      "Kitchen access",
      "Hot water 24/7",
      "Free WiFi",
      "Free parking",
    ],
    rating: 4.5,
    status: "available",
  },
  {
    title: "Kitchen Studio Apartment",
    image: "/images/rooms/kitchen.jpg",
    images: ["/images/rooms/kitchen.jpg", "/images/rooms/standard-double.jpg"],
    description:
      "A self-catering unit built around a full modular kitchen — sink, counter space, storage cabinets and a kettle. Cook your own meals after a long day on the hills. Best value for longer stays.",
    type: "Apartment",
    price: 2200,
    address: ADDRESS,
    maxGuests: 4,
    beds: 1,
    bathrooms: 1,
    amenities: [
      "Full modular kitchen",
      "Refrigerator",
      "Electric kettle",
      "Utensils provided",
      "Hot water 24/7",
      "Free WiFi",
      "Free parking",
    ],
    rating: 4.6,
    status: "available",
  },
];

const OWNER_CONTACT = "7094929674";

const transports = [
  {
    name: "Toyota Innova Crysta",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    type: "SUV",
    pricePerDay: 3500,
    seats: 7,
    ac: true,
    driverName: "Raja Shekar",
    contactNumber: OWNER_CONTACT,
    description:
      "Comfortable 7-seater for families. Covers Ooty, Coonoor, Doddabetta and Pykara sightseeing in a single day.",
    status: "available",
  },
  {
    name: "Maruti Swift Dzire",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    type: "Sedan",
    pricePerDay: 2200,
    seats: 4,
    ac: true,
    driverName: "Raja Shekar",
    contactNumber: OWNER_CONTACT,
    description:
      "Economical air-conditioned sedan for couples and small families. Great on the ghat roads.",
    status: "available",
  },
  {
    name: "Force Tempo Traveller",
    image:
      "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&w=1200&q=80",
    type: "Tempo Traveller",
    pricePerDay: 5500,
    seats: 12,
    ac: true,
    driverName: "Raja Shekar",
    contactNumber: OWNER_CONTACT,
    description:
      "12-seater for group tours and airport pick-ups from Coimbatore. Push-back seats and luggage carrier.",
    status: "available",
  },
  {
    name: "Open Jeep — Hill Safari",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    type: "Jeep",
    pricePerDay: 2800,
    seats: 6,
    ac: false,
    driverName: "Raja Shekar",
    contactNumber: OWNER_CONTACT,
    description:
      "Open-top jeep for tea estate trails and off-road viewpoints around Coonoor. Local driver-guide included.",
    status: "available",
  },
];

const seed = async () => {
  await connectDB();

  const fresh = process.argv.includes("--fresh");

  if (fresh) {
    await Room.deleteMany({});
    await Transport.deleteMany({});
    console.log("Cleared existing rooms and transport 🧹");
  }

  for (const room of rooms) {
    await Room.findOneAndUpdate({ title: room.title }, room, {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    });
    console.log(`Room ready: ${room.title}`);
  }

  for (const vehicle of transports) {
    await Transport.findOneAndUpdate({ name: vehicle.name }, vehicle, {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    });
    console.log(`Vehicle ready: ${vehicle.name}`);
  }

  console.log(
    `\nSeed complete ✅  ${rooms.length} rooms, ${transports.length} vehicles.`,
  );
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch(async (error) => {
  console.error("Seed failed ❌", error);
  await mongoose.connection.close();
  process.exit(1);
});
