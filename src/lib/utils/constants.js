//export const API_URL = "http://0.0.0.0:8001/api/";
export const API_URL = "https://rb-iit-api.softplix.com/api/";
export const INDIAN_STATES = [
  "Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Ladakh","Lakshadweep","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"
];
export const SOCIAL_LINKS = {
  FACEBOOK: "https://www.facebook.com/RBIITNEET/",
  INSTAGRAM: "https://www.instagram.com/rbiitneet/",
  YOUTUBE: "https://youtube.com/yourchannel",
  WHATSAPP: "https://wa.me/919999999999",
  TWITTER: "https://x.com/rbiitacademy",
  FOOTER_TEXT1: "RB Books",
  FOOTER_TEXT2: "Your trusted companion for IIT & NEET preparation books.",
  FOOTER_TEXT2: "© 2025 RB Books. All rights reserved.",
  TOP_HEADER_TEXT: "Welcome to RB IIT NEET Books",
};
export const SLIDER_IMAGES = [
  "/sliders/book-1.png",
  "/sliders/book-1.png",
  "/sliders/book-1.png",
];
// Public Google client id is safe to expose; read from env.
// The Google CLIENT SECRET must never live in frontend source and is not
// needed for Google Identity Services — it has been removed. If it was ever
// committed, rotate it in Google Cloud Console.
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
export const NEXT_PUBLIC_RAZORPAY_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
