import { API_URL } from "@/config/api";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function TripDetails() {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/trip-details/${tripId}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch trip details");
        const data = await response.json();
        setTripData(data);
        console.log("received", tripData);
        console.log(error);
        console.log(loading);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId]);
  console.log("received", tripData);
  console.log(error);
  console.log(loading);
  return (
    <div>
      <h1>tripDetails</h1>
    </div>
  );
}

export default TripDetails;
