import { API_URL } from "@/config/api";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  MapPin,
  Clock,
  Users,
  Wallet,
  Hotel,
  Sun,
  Star,
  Globe,
  Compass,
} from "lucide-react";
import { googlePlacePhotos } from "@/config/googlePlaces";
function TripDetails() {
  const { tripId } = useParams();
  interface TripData {
    generatedItinerary: {
      trip_name: string;
      duration: string;
      travelers: number;
      cover_image_url?: string;
      hotels: {
        hotel_name: string;
        hotel_address: string;
        price: string;
        rating: number;
        description: string;
        hotel_image_url?: string;
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

        const destinationImage = await googlePlacePhotos(
          data.tripDetails.location.description
        );
        data.generatedItinerary.cover_image_url = destinationImage;

        for (const hotel of data.generatedItinerary.hotels) {
          const hotelImage = await googlePlacePhotos(
            `${hotel.hotel_name} ${hotel.hotel_address}`
          );
          hotel.hotel_image_url = hotelImage;
        }
        const itinerary = data.generatedItinerary.itinerary;
        type DayData = {
          theme: string;
          best_time_to_visit: string;
          activities: {
            place_name: string;
            place_details: string;
            ticket_pricing: string;
            rating: number;
            travel_time: string;
            place_image_url?: string;
          }[];
        };

        for (const dayData of Object.values(itinerary) as DayData[]) {
          for (const activity of dayData.activities) {
            const activityImage = await googlePlacePhotos(activity.place_name);
            activity.place_image_url = activityImage || "/default-activity.jpg";
          }
        }
        await fetch(`${API_URL}/trips/${tripId}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
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
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 animate-pulse">
        <div className="text-primary text-2xl font-bold">
          Loading Your Adventure...
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-error/10 p-6">
        <div className="text-center">
          <div className="text-error text-3xl font-bold mb-4">
            Oops! Something Went Wrong
          </div>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  if (!tripData)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-primary text-3xl font-bold mb-4">
            No Trip Found
          </div>
          <p className="text-gray-700">Let's plan your next adventure!</p>
        </div>
      </div>
    );
  const { generatedItinerary, tripDetails } = tripData;
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Section */}
      <div
        className="bg-primary-dark text-white py-12 px-6 rounded-b-3xl shadow-lg relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${generatedItinerary.cover_image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 flex items-center text-white">
            <Globe className="mr-3 animate-float text-white" size={36} />
            {generatedItinerary.trip_name}
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                Icon: Clock,
                label: "Duration",
                value: generatedItinerary.duration,
              },
              {
                Icon: Users,
                label: "Travelers",
                value: generatedItinerary.travelers,
              },
              { Icon: Wallet, label: "Budget", value: tripDetails.budget },
              {
                Icon: MapPin,
                label: "Location",
                value: tripDetails.location.description,
              },
            ].map(({ Icon, label, value }, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Icon className="text-white" size={24} />
                <div>
                  <p className="text-xs text-gray-200">{label}</p>
                  <p className="font-semibold text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hotels Section */}
      <section className="max-w-4xl mx-auto px-6 mt-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
          <Hotel className="mr-3 text-primary-dark" size={32} />
          Recommended Hotels
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generatedItinerary.hotels.map((hotel, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 p-6"
            >
              <div
                className="h-48 w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${hotel.hotel_image_url})`,
                }}
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {hotel.hotel_name}
                </h3>
                <div className="flex items-center text-sm text-gray-700 mb-4">
                  <MapPin size={16} className="mr-2 text-primary-dark" />
                  {hotel.hotel_address}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-bold text-primary-dark">
                    {hotel.price}
                  </div>
                  <div className="flex items-center text-yellow-700">
                    <Star size={16} className="mr-1" />
                    <span>{hotel.rating}/5</span>
                  </div>
                </div>
                <p className="text-sm text-gray-800">{hotel.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Itinerary */}
      <section className="max-w-4xl mx-auto px-6 mt-12">
        <h2 className="text-2xl font-bold mb-8 flex items-center text-gray-800">
          <Compass className="mr-3 text-primary-dark" size={32} />
          Daily Itinerary
        </h2>
        {Object.entries(generatedItinerary.itinerary).map(([day, dayData]) => (
          <div
            key={day}
            className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-primary-light/10 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  {day.replace("day", "Day ")}
                </h3>
                <div className="flex items-center text-gray-700">
                  <Sun size={20} className="mr-2 text-yellow-700" />
                  {dayData.theme}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Best time: {dayData.best_time_to_visit}
              </p>
            </div>
            <div className="p-6 space-y-6">
              {dayData.activities.map((activity, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors flex items-start space-x-4"
                >
                  <div
                    className="hidden md:block h-24 w-24 flex-shrink-0 rounded-lg bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${activity.place_image_url})`,
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 mr-4">
                        {activity.place_name}
                      </h4>
                      <div className="flex items-center text-yellow-700">
                        <Star size={16} className="mr-1" />
                        {activity.rating}/5
                      </div>
                    </div>
                    <p className="text-sm text-gray-800 mb-4">
                      {activity.place_details}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-primary-dark">Price</p>
                        <p className="text-gray-800">
                          {activity.ticket_pricing}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-primary-dark">
                          Travel Time
                        </p>
                        <p className="text-gray-800">{activity.travel_time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default TripDetails;
