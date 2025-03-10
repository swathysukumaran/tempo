import React from "react";

import logo from "../../assets/logo.png";
import { Button } from "../ui/button";
import { API_URL } from "@/config/api";
import { useNavigate } from "react-router-dom";
import { Globe, Compass } from "lucide-react";
function Header() {
  const navigate = useNavigate();
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
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className="p-2 shadow-sm flex justify-between items-center ">
      <img
        src={logo}
        alt="logo"
        onClick={() => navigate("/create-trip-new")}
        className="w-auto h-12  sm:h-16 md:h-20 cursor-pointer"
      />
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate("/create-trip-new")}
        >
          <Compass size={20} />
          Create Trip
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate("/saved-trips")}
        >
          <Globe size={20} />
          My Trips
        </Button>
        <Button
          variant="ghost"
          className="bg-primary text-white"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Header;
