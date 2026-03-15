import { FaInstagram, FaFacebookF, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12 flex flex-col items-center justify-center">
      
      {/* Logo */}
      <img
        src="./logo.png"
        alt="KYNKS FIVE RESTAURANT"
        className="h-16 w-auto mb-6"
      />

      {/* Social Icons */}
      <div className="flex gap-6 text-xl">
        
        {/* Instagram */}
        <a
          href="https://instagram.com/kynksfiverestaurant"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white transition"
        >
          <FaInstagram />
        </a>

        {/* Facebook */}
        <a
          href="https://facebook.com/kynksfiverestaurant"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white transition"
        >
          <FaFacebookF />
        </a>

        {/* Email */}
        <a
          href="mailto:kynksfiverestaurant@gmail.com"
          className="hover:text-white transition"
        >
          <FaEnvelope />
        </a>

      </div>

      {/* Copyright */}
      <p className="text-xs mt-6">
        © 2026 KYNKS FIVE RESTAURANT. All rights reserved.
      </p>

    </footer>
  );
}