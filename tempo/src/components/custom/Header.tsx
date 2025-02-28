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
  const openRegisterDialog = () => {
    setDialogContent("register");
  };

  const openLoginDialog = () => {
    setDialogContent("login");
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Tempo"
              className="h-8 w-auto mr-2"
              onClick={() => navigate(isAuthenticated ? "/home" : "/")}
              style={{ cursor: "pointer" }}
            />
            <span className="text-xl font-bold text-gray-800">Tempo</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-gray-600 hover:text-gray-900"
                onClick={(e) => {
                  if (!item.href.startsWith("#")) {
                    e.preventDefault();
                    navigate(item.href);
                  }
                }}
              >
                {item.label}
              </a>
            ))}

            {/* Authentication Buttons */}
            {!isAuthenticated ? (
              // Show login/register when not authenticated
              <>
                <Dialog
                  open={dialogContent === "login"}
                  onOpenChange={() =>
                    dialogContent === "login" && setDialogContent(null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={openLoginDialog}>
                      Log in
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Log in to your account</DialogTitle>
                    </DialogHeader>
                    <Login onSuccess={() => setDialogContent(null)} />
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={dialogContent === "register"}
                  onOpenChange={() =>
                    dialogContent === "register" && setDialogContent(null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button onClick={openRegisterDialog}>Sign up</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create an account</DialogTitle>
                    </DialogHeader>
                    <Register onSuccess={() => setDialogContent(null)} />
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              // Show profile/logout when authenticated
              <Button variant="outline" onClick={logout}>
                Log out
              </Button>
            )}
          </nav>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900"
                  onClick={(e) => {
                    if (!item.href.startsWith("#")) {
                      e.preventDefault();
                      navigate(item.href);
                    }
                  }}
                >
                  {item.label}
                </a>
              ))}

              {!isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={openLoginDialog}
                  >
                    Log in
                  </Button>
                  <Button className="w-full" onClick={openRegisterDialog}>
                    Sign up
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="w-full" onClick={logout}>
                  Log out
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
