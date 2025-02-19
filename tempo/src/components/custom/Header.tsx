import React from "react";

import logo from "../../assets/logo.png";
import { Button } from "../ui/button";
import { API_URL } from "@/config/api";
import { useNavigate } from "react-router-dom";
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
        className="w-auto h-12 mx-auto sm:h-16 md:h-20"
      />
      <Button variant="ghost" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}

export default Header;
