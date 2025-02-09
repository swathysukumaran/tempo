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
import registerImage from "../../assets/register.jpeg";
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
      <div className="hidden md:block lg:w-1/2 ">
        <img
          src={registerImage}
          alt="A man relaxing on a beach"
          className="object-cover w-full h-full opacity-90" // opacity helps blend with bg
        />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="text-center justify-center items-center mb-8">
          {/* Simple musical wave logo */}
          <img src="/logo.svg" alt="logo" className="mx-auto" />
          <h1 className="text-h2 font-bold text-gray-700 mb-2">Tempo</h1>
          <p className="text-body text-gray-600">
            Enjoyour journey, your rhythm
          </p>
          <p className="text-small text-gray-500">
            Create personalized travel experiences that match your pace
          </p>
        </div>
        <Card className="w-full max-w-md ">
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
                className="w-full bg-secondary hover:bg-secondary-dark transition-colors"
              >
                Register
              </Button>

              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{" "}
                <Button
                  variant="link"
                  onClick={() => navigate("/login")}
                  className="p-0 text-primary hover:text-primary-dark"
                >
                  Login
                </Button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Register;
