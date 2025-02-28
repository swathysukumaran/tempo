import React from "react";
import { useState } from "react";
import logo from "../../assets/logo.png";
import { Button } from "../ui/button";
import { API_URL } from "@/config/api";
import { useNavigate, useLocation } from "react-router-dom";
import { Globe, Menu, X } from "lucide-react";
import Register from "./Register";
import Login from "./Login";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const isLandingPage = location.pathname === "/";

  const landingNavItems = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
  ];
  const appNavItems = [
    { label: "Home", href: "/home" },
    { label: "Saved Trips", href: "/saved-trips" },
    { label: "Create Trip", href: "/create-trip" },
  ];
  const navItems = isAuthenticated
    ? appNavItems
    : isLandingPage
    ? landingNavItems
    : [];
  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // Important for cookies
      });
      return response.ok;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className="p-2 shadow-sm flex justify-between items-center ">
      <img
        src={logo}
        alt="logo"
        onClick={() => navigate("/")}
        className="w-auto h-12 mx-auto sm:h-16 md:h-20 cursor-pointer"
      />
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate("/saved-trips")}
        >
          <Globe size={20} />
          My Trips
        </Button>
        <Button variant="ghost" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Header;
