import React, { useEffect, useState } from "react";
import { Clock, Users, Wallet, MapPin } from "lucide-react";
import { API_URL } from "@/config/api";
interface Trip {
  _id: string;
  tripDetails: {
    location: {
      description: string;
    };
    noOfDays: string;
    budget: string;
    traveler: number;
  };
  generatedItinerary: {
    trip_name: string;
    cover_image_url: string;
    travelers: string;
    travel_style: {
      pace: string;
    };
  };
  createdAt: string;
}
function MyTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(`${API_URL}/api/trips`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch trips");
        const data = await response.json();
        setTrips(data.trips);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load trips");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);
  const handleCreateTrip = () => {
    window.location.href = "/create-trip";
  };
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Trips</h1>
          <button
            onClick={handleCreateTrip}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create New Trip
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer overflow-hidden"
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    trip.generatedItinerary.cover_image_url ||
                    "/default-trip-image.jpg"
                  })`,
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {trip.generatedItinerary.trip_name}
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-2" />
                    {trip.tripDetails.location.description}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock size={16} className="mr-2" />
                    {trip.tripDetails.noOfDays} days
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users size={16} className="mr-2" />
                    {trip.tripDetails.traveler} travelers
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Wallet size={16} className="mr-2" />
                    {trip.tripDetails.budget}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Created: {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {trip.generatedItinerary.travel_style.pace} pace
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyTrips;
