import { API_URL } from "@/config/api";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import defaultActivityImage from "../../assets/default-activity.jpg";
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
  Edit,
  X,
} from "lucide-react";
import { googlePlacePhotos } from "@/config/googlePlaces";
import { Button } from "../ui/button";
function TripDetails() {
  const { tripId } = useParams();
  interface TripData {
    _id: string;
    userId: string;
    tripDetails: {
      budget: "budget" | "moderate" | "luxury";
      location: {
        label?: string; // Making optional as it might be missing
        value?: string;
      };
      timeframe: string;

      preferences: string;
      transportation?: object; // Adding new field
    };
    generatedItinerary: {
      trip_name: string;
      destination: string;
      duration: string;
      travelers: string;
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
            place_image_url: string | null; // Updated to allow null
          }[];
        };
      };
    };
    createdAt: string;
    __v: number;
  }

  const [tripData, setTripData] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Add these state variables at the top of your component
  const [changeRequest, setChangeRequest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"itinerary" | "hotels">(
    "itinerary"
  );
  const [isFabModalOpen, setIsFabModalOpen] = useState(false);
  // Add this handler function
  const handleSubmitChanges = async () => {
    if (!changeRequest.trim()) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_URL}/ai/update-trip/${tripId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          changeRequest,
        }),
      });

      if (!response.ok) throw new Error("Failed to update itinerary");

      // Refresh the page or fetch updated data
      console.log("Response", response);
      const updatedData = await response.json();
      console.log("Updated Data", updatedData);
      const destinationImage = await googlePlacePhotos(
        updatedData.tripDetails.location?.label
      );
      console.log("Destination Image", destinationImage);
      updatedData.generatedItinerary.cover_image_url = destinationImage;

      for (const hotel of updatedData.generatedItinerary.hotels) {
        console.log("Hotel", hotel.hotel_name, hotel.hotel_address);
        const hotelImage = await googlePlacePhotos(
          `${hotel.hotel_name} ${hotel.hotel_address}`
        );
        hotel.hotel_image_url = hotelImage;
        console.log("Hotel Image", hotelImage);
      }
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

      for (const dayData of Object.values(
        updatedData.generatedItinerary.itinerary
      ) as DayData[]) {
        for (const activity of dayData.activities) {
          const activityImage = await googlePlacePhotos(activity.place_name);
          activity.place_image_url = activityImage || defaultActivityImage;
        }
      }
      setTripData(updatedData);
      setChangeRequest("");
    } catch (err) {
      console.error("Error updating itinerary:", err);
      alert("Failed to update itinerary. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/trip-details/${tripId}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch trip details");
        const data = await response.json();
        console.log("Trip Data", data);
        const destinationImage = await googlePlacePhotos(
          data.tripDetails.location?.label
        );
        console.log("Destination Image", destinationImage);
        data.generatedItinerary.cover_image_url = destinationImage;

        for (const hotel of data.generatedItinerary.hotels) {
          console.log("Hotel", hotel.hotel_name, hotel.hotel_address);
          const hotelImage = await googlePlacePhotos(
            `${hotel.hotel_name} ${hotel.hotel_address}`
          );
          hotel.hotel_image_url = hotelImage;
          console.log("Hotel Image", hotelImage);
        }
        const itinerary = data.generatedItinerary.itinerary;
        console.log("Itinerary", itinerary);
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
            activity.place_image_url = activityImage || defaultActivityImage;
          }
        }

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
  const FloatingActionButton = () => {
    return (
      <Button
        onClick={() => setIsFabModalOpen(true)}
        className="fixed bottom-10 right-10 z-50 bg-primary text-white 
        w-16 h-16 rounded-full shadow-xl hover:bg-primary-dark 
        transition-all duration-300 ease-in-out transform 
        hover:scale-110 flex items-center justify-center"
      >
        <Edit className="w-8 h-8" />
      </Button>
    );
  };
  const ChangeRequestModal = () => {
    // Use a local state to prevent unnecessary re-renders
    const [localChangeRequest, setLocalChangeRequest] = useState(changeRequest);

    const handleSubmit = () => {
      // Update the parent component's state when submitting
      setChangeRequest(localChangeRequest);
      handleSubmitChanges();
    };

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[100] 
      flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
          <button
            onClick={() => setIsFabModalOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold flex items-center text-gray-800 mb-4">
            <Edit className="mr-3 text-primary" size={32} />
            Customize Your Trip
          </h2>

          <p className="text-gray-600 mb-4">
            Not quite what you're looking for? Describe the changes you'd like
            to make, and we'll update your itinerary.
          </p>

          <textarea
            className="w-full border border-gray-200 rounded-lg p-4 min-h-[150px] 
          focus:border-primary focus:ring-1 focus:ring-primary/20"
            placeholder="Examples: 'Include a day trip to...', 'Change hotel to...'"
            value={localChangeRequest}
            onChange={(e) => setLocalChangeRequest(e.target.value)}
          />

          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary text-white hover:bg-primary-dark"
            >
              {isSubmitting ? "Updating Itinerary..." : "Submit Changes"}
            </Button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-white pb-16">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center backdrop-blur-sm transition-all duration-300">
          <div className="flex justify-center items-center min-h-screen animate-pulse">
            <div className="text-white text-2xl font-bold">
              Updating Your Trip...
            </div>
          </div>
        </div>
      )}
      <div
        className="text-white py-12 px-6 rounded-b-3xl shadow-xl relative min-h-[50vh]"
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
                value:
                  tripDetails.location?.label || generatedItinerary.destination,
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
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("itinerary")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "itinerary"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Compass className="inline-block mr-2 -mt-1" size={20} />
            Daily Itinerary
          </button>
          <button
            onClick={() => setActiveTab("hotels")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "hotels"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Hotel className="inline-block mr-2 -mt-1" size={20} />
            Recommended Hotels
          </button>
        </div>
        {/* Daily Itinerary */}
        {activeTab === "itinerary" && (
          <section>
            {Object.entries(generatedItinerary.itinerary).map(
              ([day, dayData]) => (
                <div
                  key={day}
                  className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                >
                  <div className="border-b border-gray-200 p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-800">
                        {day.replace("day", "Day ")}
                      </h3>
                      <div className="flex items-center text-gray-700">
                        <Sun size={20} className="mr-2 text-yellow-600" />
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
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all flex items-start space-x-4"
                      >
                        <div
                          className="hidden md:block h-24 w-24 flex-shrink-0 rounded-lg bg-cover bg-center border border-gray-200"
                          style={{
                            backgroundImage: `url(${
                              activity.place_image_url || defaultActivityImage
                            })`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundColor: activity.place_image_url
                              ? "transparent"
                              : "#f0f0f0",
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="text-lg font-semibold text-gray-900 mr-4">
                              {activity.place_name}
                            </h4>
                            <div className="flex items-center text-yellow-600">
                              <Star size={16} className="mr-1" />
                              {activity.rating}/5
                            </div>
                          </div>
                          <p className="text-sm text-gray-800 mb-4">
                            {activity.place_details}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-semibold text-primary">
                                Price
                              </p>
                              <p className="text-gray-800">
                                {activity.ticket_pricing}
                              </p>
                            </div>
                            <div>
                              <p className="font-semibold text-primary">
                                Travel Time
                              </p>
                              <p className="text-gray-800">
                                {activity.travel_time}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </section>
        )}

        {activeTab === "hotels" && (
          <section>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedItinerary.hotels.map((hotel, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transition-all transform hover:-translate-y-2"
                >
                  <div
                    className="h-48 w-full bg-cover bg-center rounded-t-xl"
                    style={{
                      backgroundImage: `url(${hotel.hotel_image_url})`,
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {hotel.hotel_name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-700 mb-4">
                      <MapPin size={16} className="mr-2 text-primary" />
                      {hotel.hotel_address}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-lg font-bold text-primary">
                        {hotel.price}
                      </div>
                      <div className="flex items-center text-yellow-600">
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
        )}
      </section>

      <section className="max-w-4xl mx-auto px-6 mt-12">
        <div className="border border-gray-200 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800">
            <Edit className="mr-3 text-primary" size={32} />
            Request Changes to Your Itinerary
          </h2>
          <p className="text-gray-600 mb-4">
            Not quite what you're looking for? Describe the changes you'd like
            to make, and we'll update your itinerary.
          </p>

          <textarea
            className="w-full border border-gray-200 rounded-lg p-4 min-h-[150px] focus:border-primary focus:ring-1 focus:ring-primary/20"
            placeholder="Examples: 'Include a day trip to ....'"
            value={changeRequest}
            onChange={(e) => setChangeRequest(e.target.value)}
          />

          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSubmitChanges}
              disabled={isSubmitting}
              className="bg-primary text-white hover:bg-primary-dark"
            >
              {isSubmitting ? "Updating Itinerary..." : "Submit Changes"}
            </Button>
          </div>
        </div>
      </section>

      <FloatingActionButton />
      {/* FAB Modal */}
      {isFabModalOpen && <ChangeRequestModal />}
    </div>
  );
}

export default TripDetails;
