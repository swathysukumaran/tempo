import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";
function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  interface ErrorResponse {
    error: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const data: ErrorResponse = await response.json();
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Registration failed");
      console.log(err);
    }
  };
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        {/* Decorative Wave Patterns */}
        <div className="absolute inset-0">
          <svg
            className="w-full h-full text-primary-light opacity-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C40,40 60,40 100,0 L100,100 L0,100 Z"
              fill="currentColor"
            />
            <path
              d="M0,50 C40,30 60,70 100,50 L100,100 L0,100 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Centered Icon/Logo with Text */}
        <div className="relative text-white text-center px-8">
          <div className="mb-4">
            <img src="/logo.svg" alt="logo" />
          </div>
          <h1 className="text-h1 font-extrabold mb-2">Tempo</h1>
          <p className="text-body opacity-90">Travel at your own rhythm</p>
        </div>
      </div>
      <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your details to register</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#FF8364] hover:bg-[#E65C3A] transition-colors"
            >
              Register
            </Button>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <Button
                variant="link"
                onClick={() => navigate("/login")}
                className="p-0 text-[#4ECDC4] hover:text-[#2B8B85]"
              >
                Login
              </Button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
