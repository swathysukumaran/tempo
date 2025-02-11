import React, { useEffect, useState } from "react";
import coverImage from "../../assets/cover.jpg";
import SavedTrips from "./SavedTrips";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { API_URL } from "@/config/api";
import { useNavigate } from "react-router-dom";
function Hero() {
  type Option = {
    label: string;
    value: string;
    description?: string;
  };
  type FormData = {
    [key: string]: string | number | boolean | Option;
  };
  const [place, setPlace] = useState<Option | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [savedPreferences, setSavedPreferences] = useState({
    pace: "",
    activities: [] as string[],

    startTime: "",

    avoidances: [] as string[],
  });

  const PreferencesSection = () => {
    if (!savedPreferences) return null;

    return (
      <div className="border rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Your Travel Preferences</h3>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary-dark text-sm whitespace-nowrap"
            onClick={() => navigate("/onboarding")}
          >
            Update Preferences
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div>
            🚶‍♂️ Pace:{" "}
            <span className="font-medium capitalize">
              {savedPreferences.pace}
            </span>
          </div>

          <div>
            🌅 Start Time:{" "}
            <span className="font-medium capitalize">
              {savedPreferences.startTime}
            </span>
          </div>
        </div>
      </div>
    );
  };
  const navigate = useNavigate();
  // Load saved preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch(`${API_URL}/preferences`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setSavedPreferences(data.preferences);
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };
    loadPreferences();
  }, []);
  const handleInputChange = (
    name: string,
    value: string | number | boolean
  ) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const onGenerateTrip = async () => {
    if (
      Number(formData?.noOfDays) > 5 ||
      !formData?.location ||
      !formData?.budget ||
      !formData?.traveler
    ) {
      toast("Please fill all details");
      return;
    }
    const tripData = {
      location: formData.location,
      noOfDays: formData.noOfDays,
      budget: formData.budget,
      traveler: formData.traveler,
    };
    console.log(tripData);
    try {
      const response = await fetch(`${API_URL}/ai/create-trip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(tripData),
      });
      if (!response.ok) throw new Error("Failed to generate trip");
      const trip = await response.json();
      console.log(trip);
      navigate(`/trip-details/${trip.tripId}`);
    } catch (error) {
      toast("Something went wrong");
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen  flex flex-col">
      <div className="min-h-[85vh] relative">
        <div className="absolute inset-0">
          <img
            src={coverImage} // Replace with your image path
            alt="Travel Background"
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col items-center pt-12 px-4">
          {/* Hero Text */}
          <div className="text-center text-white mb-8">
            <h1 className="text-xl md:text-3xl font-bold mb-2">
              Your Journey, Your Rhythm
            </h1>
            <p className="text-sm md:text-lg">
              Create personalized travel experiences that match your pace
            </p>
          </div>
          {/* Floating Form Card */}
          <div className="w-full px-4 md:max-w-5xl md:mx-auto shadow-md">
            <div className="bg-white w-full px-4 md:max-w-5xl md:mx-auto">
              {/* Main Trip Details Row */}
              <div className="p-4 md:p-6 border-b border-gray-100">
                <div className="flex flex-col space-y-4 md:space-y-0 md:grid md:grid-cols-5 md:gap-4">
                  <div className="md:col-span-2">
                    <GooglePlacesAutocomplete
                      selectProps={{
                        value: place,
                        onChange: (v) => {
                          setPlace(v as Option);
                          handleInputChange("location", v ? v.value : "");
                        },
                        placeholder: "Search for a destination...",
                        styles: {
                          control: (provided) => ({
                            ...provided,
                            padding: "2px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                          }),
                        },
                      }}
                    />
                  </div>

                  <div>
                    <select className="w-full p-3 rounded-lg border border-gray-200 focus:ring-primary focus:border-primary">
                      <option value="">Budget</option>
                      <option value="budget">Budget Friendly</option>
                      <option value="moderate">Moderate</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      min="1"
                      placeholder="Days"
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <button
                      onClick={onGenerateTrip}
                      className="w-full bg-secondary hover:bg-secondary-dark text-white p-3 rounded-lg transition-colors"
                    >
                      Create Trip
                    </button>
                  </div>
                </div>
              </div>

              {/* Preferences Row */}
              <div className="px-4 py-3 md:px-6 md:py-4 bg-gray-50/50">
                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
                  {/* <div className="flex overflow-x-auto pb-2 md:pb-0 gap-3 md:gap-4 hide-scrollbar"> */}
                  <PreferencesSection />
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" bg-gray-50 ">
        <SavedTrips />
      </div>
    </div>
  );
}

export default Hero;
