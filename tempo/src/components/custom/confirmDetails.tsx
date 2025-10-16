import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TripData } from "@/lib/types";
function ConfirmDetails() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { tripData?: TripData } };
  const tripData = location.state?.tripData;
  console.log("confirm page", tripData);
  if (!tripData) {
    navigate("/", { replace: true });
    return null;
  }
  return (
    <div>
      <h2>Confirm Your Details</h2>
    </div>
  );
}

export default ConfirmDetails;
