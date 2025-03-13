import React, { useEffect, useState } from "react";
import coverImage from "../../assets/cover.jpg";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { API_URL } from "@/config/api";
import { SelectBudgetOptions, SelectTravelersList } from "@/constants/options";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import TripLoadingAnimation from "../custom/TripLoadingAnimation";
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
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [savedPreferences, setSavedPreferences] = useState({
    pace: "",
    activities: [] as string[],

    startTime: "",

    avoidances: [] as string[],
  });

  const PreferencesSection = () => {
    if (!savedPreferences) return null;

    // Helper function to get emoji for each preference type
    const getPreferenceEmoji = (type: string) => {
      const emojiMap = {
        pace: "🚶‍♂️",
        activities: "🎯",
        startTime: "🌅",
        avoidances: "⚠️",
      };
      return emojiMap[type as keyof typeof emojiMap];
    };

    return (
      <div className="rounded-lg border md:w-[60%] border-gray-100 bg-white/50 backdrop-blur-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-medium text-gray-800">Your Travel Style</h3>
            <p className="text-sm text-gray-500">
              These preferences will shape your trip
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary-dark text-sm"
            onClick={() => navigate("/onboarding")}
          >
            Modify
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Pace */}
          <div className="flex items-center gap-2 p-2 rounded-md bg-primary/5">
            <span className="text-lg">{getPreferenceEmoji("pace")}</span>
            <div>
              <p className="text-xs text-gray-500">Travel Pace</p>
              <p className="font-medium capitalize">
                {savedPreferences.pace || "Not set"}
              </p>
            </div>
          </div>

          {/* Start Time */}
          <div className="flex items-center gap-2 p-2 rounded-md bg-primary/5">
            <span className="text-lg">{getPreferenceEmoji("startTime")}</span>
            <div>
              <p className="text-xs text-gray-500">Day Start</p>
              <p className="font-medium capitalize">
                {savedPreferences.startTime || "Not set"}
              </p>
            </div>
          </div>

          {/* Activities */}
          <div className="flex items-start gap-2 p-2 rounded-md bg-primary/5">
            <span className="text-lg">{getPreferenceEmoji("activities")}</span>
            <div>
              <p className="text-xs text-gray-500">Interests</p>
              {savedPreferences.activities.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {savedPreferences.activities.map((activity) => (
                    <span
                      key={activity}
                      className="text-xs px-2 py-0.5 bg-white rounded-full text-primary"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-medium">Not set</p>
              )}
            </div>
          </div>

          {/* Avoidances */}
          <div className="flex items-start gap-2 p-2 rounded-md bg-primary/5">
            <span className="text-lg">{getPreferenceEmoji("avoidances")}</span>
            <div>
              <p className="text-xs text-gray-500">Preferences to Avoid</p>
              {savedPreferences.avoidances.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {savedPreferences.avoidances.map((avoidance) => (
                    <span
                      key={avoidance}
                      className="text-xs px-2 py-0.5 bg-white rounded-full text-secondary"
                    >
                      {avoidance}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-medium">None specified</p>
              )}
            </div>
          </div>
        </div>

        {!savedPreferences.pace && (
          <p className="text-xs text-gray-500 mt-3">
            💡 Complete your travel preferences to get better personalized
            recommendations
          </p>
        )}
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
      setIsLoading(true);
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
      setIsLoading(false);
      console.log(error);
    }
  };
  if (isLoading) {
    return <TripLoadingAnimation />;
  }

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
        <div className="relative h-full flex flex-col  items-center px-4 pt-16 md:pt-12">
          <div className="text-center text-white mb-12 md:mb-20 my-auto">
            <h1 className="text-2xl md:text-h1 font-bold mb-3 md:mb-4">
              Your Journey, Your Rhythm
            </h1>
            <p className="text-lg md:text-h3">
              Create personalized travel experiences that match your pace
            </p>
          </div>
          {/* Floating Form Card */}
        </div>
      </div>
      <div className="bg-white w-[95%] md:w-[80%] mx-auto  rounded-t-xl shadow-lg">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl md:text-3xl font-bold">
              Tell us your travel vibe 🏖️🌍
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-500">
              Share your preferences, and let us craft a personalized adventure
              just for you!"
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Row 1: Destination and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="col-span-full md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">
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
                        minHeight: "42px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                      }),
                    },
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Duration
                </label>
                <Input
                  placeholder="Days"
                  type="number"
                  className="w-full h-[42px] "
                  onChange={(e) =>
                    handleInputChange("noOfDays", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Budget Options */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Budget Range
              </label>
              <div className="flex overflow-x-auto gap-2 -mx-4 px-4 md:mx-0 pb-2 md:pb-0 hide-scrollbar">
                {SelectBudgetOptions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInputChange("budget", item.title)}
                    className={`flex-shrink-0 px-3 py-2 md:px-4 md:py-2.5 border rounded-lg cursor-pointer transition-all
                  ${
                    formData.budget === item.title
                      ? "border-primary bg-primary/5"
                      : "border-gray-200"
                  }
                `}
                  >
                    <div className="flex items-center gap-2 min-w-[120px] md:min-w-[140px]">
                      <span className="text-xl md:text-2xl">{item.icon}</span>
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
              <label className="block text-sm font-medium mb-1.5">
                Travel With
              </label>
              <div className="flex overflow-x-auto gap-2 -mx-4 px-4 md:mx-0 pb-2 md:pb-0 hide-scrollbar">
                {SelectTravelersList.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInputChange("traveler", item.people)}
                    className={`flex-shrink-0 px-3 py-2 md:px-4 md:py-2.5 border rounded-lg cursor-pointer transition-all
                  ${
                    formData.traveler === item.people
                      ? "border-primary bg-primary/5"
                      : "border-gray-200"
                  }
                `}
                  >
                    <div className="flex items-center gap-2 min-w-[120px] md:min-w-[140px]">
                      <span className="text-xl md:text-2xl">{item.icon}</span>
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
            <div className="flex flex-col  md:flex-row md:items-center justify-between gap-4 pt-4 border-t">
              <PreferencesSection />
              <Button onClick={onGenerateTrip} className="w-full md:w-auto">
                Generate Trip
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
