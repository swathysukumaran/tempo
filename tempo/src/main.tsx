import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import CreateTrip from "./create-trip/index.tsx";
import Header from "./components/custom/Header.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import Register from "./components/custom/Register.tsx";
import Login from "./components/custom/Login.tsx";
import TripDetails from "./components/custom/tripDetails.tsx";
import MyTrips from "./components/custom/MyTrips.tsx";
import LandingPage from "./components/custom/LandingPage.tsx";
import CreateTripNew from "./components/custom/createTripNew.tsx";
import Contact from "./components/custom/Contact.tsx";
import PrivacyPolicy from "./components/custom/PrivacyPolicy.tsx";
import TermsOfService from "./components/custom/TermsOfService.tsx";

// Create a layout component that conditionally renders Header
const RootLayout = () => {
  const location = useLocation();

  // List of paths where Header should not be shown
  const noHeaderPaths = ["/login", "/", "/register", "/landing"];

  return (
    <>
      {!noHeaderPaths.includes(location.pathname) && <Header />}
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/home",
        element: <App />,
      },
      {
        path: "/create-trip-new",
        element: <CreateTripNew />,
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
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/saved-trips",
        element: <MyTrips />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms",
        element: <TermsOfService />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1075418359786-c91d8abaaaspc4dmkta33uo4chjcgbuo.apps.googleusercontent.com">
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);
