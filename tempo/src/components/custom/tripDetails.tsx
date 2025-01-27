import { API_URL } from "@/config/api";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function TripDetails() {
  const { tripId } = useParams();
  interface TripData {
    generatedItinerary: {
      trip_name: string;
      duration: string;
      travelers: number;
      hotels: {
        hotel_name: string;
        hotel_address: string;
        price: string;
        rating: number;
        description: string;
      }[];
      itinerary: {
        [day: string]: {
          theme: string;
          best_time_to_visit: string;
          activities: {
            place_name: string;
            place_details: string;
            ticket_pricing: string;
            rating: number;
            travel_time: string;
            place_image_url: string;
          }[];
        };
      };
    };
    tripDetails: {
      budget: string;
      location: {
        description: string;
      };
    };
  }

  const [tripData, setTripData] = useState<TripData | null>(null);
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
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!tripData) return <div>No trip found</div>;
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Trip Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{tripData.generatedItinerary.trip_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p>{tripData.generatedItinerary.duration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Travelers</p>
              <p>{tripData.generatedItinerary.travelers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Budget</p>
              <p>{tripData.tripDetails.budget}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p>{tripData.tripDetails.location.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotels */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Hotels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tripData.generatedItinerary.hotels.map((hotel, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold">{hotel.hotel_name}</h3>
                <p className="text-sm text-gray-600">{hotel.hotel_address}</p>
                <p className="text-sm mt-2">{hotel.price}</p>
                <p className="text-sm">Rating: {hotel.rating}/5</p>
                <p className="text-sm mt-2">{hotel.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      {/* Daily Itinerary */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Daily Itinerary</h2>
        {Object.entries(tripData.generatedItinerary.itinerary).map(
          ([day, dayData]) => (
            <Card key={day}>
              <CardHeader>
                <CardTitle className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-primary">
                    {day.replace("day", "Day ")}
                  </span>
                  <span className="text-xl">{dayData.theme}</span>
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Best time: {dayData.best_time_to_visit}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {dayData.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="grid md:grid-cols-3 gap-4">
                        <img
                          src={activity.place_image_url}
                          alt={activity.place_name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="md:col-span-2 p-4">
                          <h3 className="font-semibold text-lg">
                            {activity.place_name}
                          </h3>
                          <p className="text-sm mt-2">
                            {activity.place_details}
                          </p>
                          <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <p className="font-semibold">Price</p>
                              <p>{activity.ticket_pricing}</p>
                            </div>
                            <div>
                              <p className="font-semibold">Rating</p>
                              <div className="flex items-center">
                                <span className="text-yellow-400">★</span>
                                <span className="ml-1">
                                  {activity.rating}/5
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold">Travel Time</p>
                              <p>{activity.travel_time}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}

export default TripDetails;
