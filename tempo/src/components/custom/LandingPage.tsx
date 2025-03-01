import React, { useState } from "react";
import logo from "../../assets/logo.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import Login from "./Login";
import Register from "./Register";
import register from "../../assets/register.jpeg";
import { Menu, X } from "lucide-react";
import { Card, CardContent } from "../ui/card";

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);

  const openRegisterDialog = () => {
    setDialogContent("register");
  };

  const openLoginDialog = () => {
    setDialogContent("login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={logo} alt="Tempo" className="h-8 w-auto mr-2" />
              <span className="text-xl font-bold text-gray-800">Tempo</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-gray-900"
              >
                How It Works
              </a>
              <a href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a href="#examples" className="text-gray-600 hover:text-gray-900">
                Examples
              </a>
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
                    <DialogDescription>
                      Enter your credentials to log in
                    </DialogDescription>
                  </DialogHeader>
                  <Login />
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
                    <DialogDescription>
                      Enter your details to register
                    </DialogDescription>
                  </DialogHeader>
                  <Register />
                </DialogContent>
              </Dialog>
            </nav>

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
                <a
                  href="#how-it-works"
                  className="text-gray-600 hover:text-gray-900"
                >
                  How It Works
                </a>
                <a
                  href="#features"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Features
                </a>
                <a
                  href="#examples"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Examples
                </a>
                <Dialog
                  open={dialogContent === "login"}
                  onOpenChange={() =>
                    dialogContent === "login" && setDialogContent(null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={openLoginDialog}
                    >
                      Log in
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Log in to your account</DialogTitle>
                      <DialogDescription>
                        Enter your credentials to log in
                      </DialogDescription>
                    </DialogHeader>
                    <Login />
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={dialogContent === "register"}
                  onOpenChange={() =>
                    dialogContent === "register" && setDialogContent(null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button className="w-full" onClick={openRegisterDialog}>
                      Sign up
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create an account</DialogTitle>
                      <DialogDescription>
                        Enter your details to register
                      </DialogDescription>
                    </DialogHeader>
                    <Register />
                  </DialogContent>
                </Dialog>
              </nav>
            </div>
          )}
        </div>
      </header>
      <section>
        <section className="flex flex-col md:flex-row items-center justify-between  mx-auto ">
          <div className="w-full md:w-1/2">
            <img src={register} alt=" a man relaxing on beach" />
          </div>
          <div className="w-full md:w-1/2 p-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Travel at your rhythm
            </h1>
            <p className="text-xl text-gray-600 py-2">
              Discover personalized itineraries powered by AI, designed to match
              your interests, pace, and travel style.
            </p>
          </div>
        </section>
      </section>
    </div>
  );
}

export default LandingPage;
