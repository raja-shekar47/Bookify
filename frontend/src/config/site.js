/** Single source of truth for brand + contact details. */
export const SITE = {
  name: "Aaron Stays",
  shortName: "Aaron",
  tagline: "Homely rooms in the Queen of Hills",
  location: "Ooty, The Nilgiris, Tamil Nadu",
  address: "Aaron Stays, Ooty, The Nilgiris, Tamil Nadu 643001",
  phone: "7094929674",
  phoneDisplay: "+91 70949 29674",
  email: "rajurajshekar2023@gmail.com",
  whatsapp: "917094929674",
  checkInTime: "12:00 PM",
  checkOutTime: "11:00 AM",
  mapsUrl: "https://maps.google.com/?q=Ooty,+Tamil+Nadu",
};

export const telHref = `tel:+91${SITE.phone}`;
export const mailHref = `mailto:${SITE.email}`;
export const whatsappHref = `https://wa.me/${SITE.whatsapp}`;
