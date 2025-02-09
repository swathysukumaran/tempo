import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import CreateTrip from "./create-trip/index.tsx";
import Header from "./components/custom/Header.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import Register from "./components/custom/Register.tsx";
import Login from "./components/custom/Login.tsx";
import TripDetails from "./components/custom/tripDetails.tsx";
import Onboarding from "./components/custom/Onboarding.tsx";
import AuthLayout from "./components/custom/AuthLayout.tsx";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/home",
    element: <App />,
  },
  {
    path: "/create-trip",
    element: <CreateTrip />,
  },
  {
    path: "/trip-details/:tripId",
    element: <TripDetails />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1075418359786-c91d8abaaaspc4dmkta33uo4chjcgbuo.apps.googleusercontent.com">
      <Header />
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);
