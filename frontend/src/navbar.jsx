import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header id="header" className="bg-neutral-900 text-white fixed w-full z-50">
    <nav className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold">
          <span className="text-[#1E8449]">Smart</span>
          <span className="text-[#3498DB]">Waste</span>
        </a>
  
        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center"
          aria-label="Toggle navigation menu"
          onClick={toggleMobileMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
  
        {/* Responsive navigation */}
        <ul
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-neutral-900 md:bg-transparent p-4 md:p-0 rounded-lg shadow-lg md:shadow-none transform transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full md:opacity-100 md:translate-y-0 hidden md:flex"
          }`}
        >
          {[
            { to: "/", label: "Home" },
            { to: "/report", label: "Report Waste" },
            { to: "/reward", label: "GreenCoins" },
            { to: "/marketplace", label: "Marketplace" },
          ].map((item, index) => (
            <li key={index} onClick={() => setIsMobileMenuOpen(false)}>
              <Link
                to={item.to}
                className="block py-2 px-4 md:py-0 hover:text-[#F39C12] transition-colors duration-300"
              >
                {item.label}
              </Link>
            </li>
          ))}
  
          {/* Buttons displayed in a row */}
          <div className="flex gap-4 justify-center mt-4 md:mt-0">
            <li onClick={() => setIsMobileMenuOpen(false)}>
              <SignedOut>
                <SignInButton className="bg-[#1e8449] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#166534] active:shadow-lg transition cursor-pointer" />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </li>
            <li
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate("/admin");
              }}
            >
              <button className="bg-[#1e8449] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#166534] active:shadow-lg transition cursor-pointer">
                Admin
              </button>
            </li>
          </div>
        </ul>
      </div>
    </nav>
  </header>
  
  );
}
