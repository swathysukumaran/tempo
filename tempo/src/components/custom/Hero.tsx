import React, { useEffect, useState } from "react";
import coverImage from "../../assets/cover.jpg";
import SavedTrips from "./SavedTrips";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { API_URL } from "@/config/api";
import { SelectBudgetOptions, SelectTravelersList } from "@/constants/options";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
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
          {/* Floating Form Card */}
        </div>
      </div>
      <div className="bg-white  w-full ">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Your Journey, Your Rhythm
            </h2>
            <p className="mt-2 text-gray-500">Let's plan your perfect trip</p>
          </div>

          <div className="space-y-6">
            {/* Row 1: Destination and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Destination
                </label>
                <GooglePlacesAutocomplete
                  selectProps={{
                    value: place,
                    onChange: (v) => {
                      setPlace(v as Option);
                      handleInputChange("location", v ? v.value : "");
                    },
                    placeholder: "Where to?",
                    styles: {
                      control: (provided) => ({
                        ...provided,
                        padding: "6px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                      }),
                    },
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Duration
                </label>
                <Input
                  placeholder="Days"
                  type="number"
                  className="w-full"
                  onChange={(e) =>
                    handleInputChange("noOfDays", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Budget Options */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Budget Range
              </label>
              <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
                {SelectBudgetOptions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInputChange("budget", item.title)}
                    className={`flex-shrink-0 px-4 py-2.5 border rounded-lg cursor-pointer transition-all hover:shadow-sm
                    ${
                      formData.budget === item.title
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    }
                  `}
                  >
                    <div className="flex items-center gap-2.5 min-w-[140px]">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        {/* <p className="text-xs text-gray-500">{item.desc}</p> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travelers */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Travel With
              </label>
              <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
                {SelectTravelersList.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInputChange("traveler", item.people)}
                    className={`flex-shrink-0 px-4 py-2.5 border rounded-lg cursor-pointer transition-all hover:shadow-sm
          ${
            formData.traveler === item.people
              ? "border-primary bg-primary/5"
              : "border-gray-200"
          }
        `}
                  >
                    <div className="flex items-center gap-2.5 min-w-[140px]">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        {/* <p className="text-xs text-gray-500">{item.desc}</p> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences and Submit */}
            <div className="flex items-center justify-between border-t pt-4 mt-4">
              <PreferencesSection />
              <Button onClick={onGenerateTrip}>Generate Trip</Button>
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
