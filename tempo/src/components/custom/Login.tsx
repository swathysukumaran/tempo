import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";
import { Alert, AlertDescription } from "../ui/alert";

import { toast } from "sonner";
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      console.log("API_URL", API_URL);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Check onboarding status
        try {
          const onboardingResponse = await fetch(
            `${API_URL}/onboarding/status`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }
          );

          const data = await onboardingResponse.json();
          toast.success("Login successful! Redirecting...");
          setTimeout(() => {
            if (!data.onboarding || data.onboarding.status !== "completed") {
              navigate("/onboarding");
            } else {
              navigate("/home");
            }
          }, 1000);
        } catch (error) {
          console.error("Onboarding status check failed:", error);
          navigate("/onboarding"); // Fallback to onboarding if status check fails
        }
      } else {
        const data = await response.json();
        if (data.error === "Invalid credentials") {
          setError("Invalid credentials");
        } else {
          setError(data.error || "Login failed. Please try again");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Enter your credentials to login</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
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

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default Login;
