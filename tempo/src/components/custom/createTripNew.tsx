import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Activity,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Info,
  MapPin,
  Moon,
  Mountain,
  Star,
} from "lucide-react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

import { Input } from "../ui/input";
type StepId =
  | "destination"
  | "duration"
  | "preferences"
  | "mustDoAvoid"
  | "accommodation"
  | "paceStructure"
  | "budget"
  | "summary";

// Define all steps
const steps: StepId[] = [
  "destination",
  "duration",
  "preferences",
  "mustDoAvoid",
  "accommodation",
  "paceStructure",
  "budget",
  "summary",
];

type Option = {
  label: string;
  value: string;
  description?: string;
};

type TripFormData = {
  destination: Option | null;
  duration: string;
  preferences: string[];
  mustDo: string[];
  mustAvoid: string[];
  accommodation: string;
  pace: string;
  structure: string;
  budget: string;
  customNotes: string;
};
function CreateTripNew() {
  const [currentStep, setCurrentStep] = useState<StepId>("destination");
  const [formData, setFormData] = useState<TripFormData>({
    destination: null,
    duration: "",
    preferences: [],
    mustDo: [],
    mustAvoid: [],
    accommodation: "",
    pace: "",
    structure: "",
    budget: "",
    customNotes: "",
  });
  const goToNextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // Update form data
  const updateFormData = (
    field: keyof TripFormData,
    value: string | string[] | Option | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const renderStepContent = () => {
    switch (currentStep) {
      case "destination":
        return (
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-h2 font-medium text-gray-800">
                Where are you headed?
              </h2>
              <p className="text-body text-gray-500">
                Let's start planning your perfect trip by choosing a
                destination.
              </p>
            </div>

            <div className="w-full max-w-md mx-auto">
              <GooglePlacesAutocomplete
                selectProps={{
                  value: formData.destination,
                  onChange: (value) => updateFormData("destination", value),
                  placeholder: "Search for a destination...",
                  styles: {
                    control: (provided) => ({
                      ...provided,
                      padding: "8px",
                      borderRadius: "8px",
                      border: "1px solid #F3F4F6",
                      boxShadow: "none",
                      transition: "all 150ms ease",
                      "&:hover": {
                        borderColor: "#0D9488",
                      },
                      "&:focus-within": {
                        borderColor: "#0D9488",
                        boxShadow: "0 0 0 1px #0D9488",
                      },
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: "#6B7280",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isFocused ? "#F3F4F6" : "white",
                      color: "#1F2937",
                      "&:hover": {
                        backgroundColor: "#F3F4F6",
                      },
                    }),
                  },
                }}
              />
            </div>

            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium text-gray-700">
                  Popular destinations
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Tokyo, Japan",
                  "Paris, France",
                  "Bali, Indonesia",
                  "New York, USA",
                  "Rome, Italy",
                ].map((place) => (
                  <button
                    key={place}
                    className={`px-3 py-1.5 text-small rounded-md transition-colors ${
                      formData.destination?.label === place
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-white text-gray-700 border border-gray-100 hover:border-primary/20 hover:text-primary"
                    }`}
                    onClick={() => {
                      updateFormData("destination", {
                        label: place,
                        value: place,
                      });
                    }}
                  >
                    {place}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case "duration":
        return (
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-h2 font-medium text-gray-800">
                How long are you staying?
              </h2>
              <p className="text-body text-gray-500">
                Choose or enter the length of your trip to{" "}
                {formData.destination?.label}.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { id: "weekend", label: "Weekend (2 days)", value: "2" },
                { id: "short", label: "Short Trip (4 days)", value: "4" },
                { id: "week", label: "One Week (7 days)", value: "7" },
                { id: "long", label: "Extended (10+ days)", value: "10+" },
              ].map((option) => (
                <button
                  key={option.id}
                  className={`px-4 py-2 rounded-full transition-all ${
                    formData.duration === option.value
                      ? "bg-primary text-white"
                      : "bg-gray-50 border border-gray-100 text-gray-800 hover:bg-gray-100"
                  }`}
                  onClick={() => updateFormData("duration", option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mt-8 bg-gray-50 p-5 rounded-lg border border-gray-100 max-w-md mx-auto">
              <p className="text-body text-gray-700 mb-3 text-center font-medium">
                Or enter a specific number of days
              </p>
              <div className="flex items-center">
                <Input
                  type="number"
                  placeholder="Number of days"
                  min="1"
                  max="30"
                  value={formData.duration === "10+" ? "" : formData.duration}
                  onChange={(e) => updateFormData("duration", e.target.value)}
                  className="flex-1 text-center border-gray-200 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <p className="text-small text-gray-500 mt-2 text-center">
                Enter any number between 1-30 days
              </p>
            </div>
          </div>
        );
      case "preferences":
        return (
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-h2 font-medium text-gray-800">
                What matters most for this trip?
              </h2>
              <p className="text-body text-gray-500">
                Select what you're most interested in experiencing during your
                visit to {formData.destination?.label}.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {[
                {
                  id: "nature",
                  name: "Peace & Nature",
                  icon: <Mountain className="h-4 w-4 mr-1" />,
                },
                {
                  id: "culture",
                  name: "Culture & History",
                  icon: <Briefcase className="h-4 w-4 mr-1" />,
                },
                {
                  id: "food",
                  name: "Food & Local Experiences",
                  icon: <Coffee className="h-4 w-4 mr-1" />,
                },
                {
                  id: "adventure",
                  name: "Adventure & Activities",
                  icon: <Activity className="h-4 w-4 mr-1" />,
                },
                {
                  id: "luxury",
                  name: "Luxury & Comfort",
                  icon: <Star className="h-4 w-4 mr-1" />,
                },
                {
                  id: "social",
                  name: "Social & Nightlife",
                  icon: <Moon className="h-4 w-4 mr-1" />,
                },
              ].map((preference) => (
                <button
                  key={preference.id}
                  className={`px-4 py-2 rounded-full transition-all flex items-center ${
                    formData.preferences.includes(preference.id)
                      ? "bg-primary text-white"
                      : "bg-gray-50 border border-gray-100 text-gray-800 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    // Toggle the preference
                    const newPreferences = [...formData.preferences];
                    const index = newPreferences.indexOf(preference.id);
                    if (index === -1) {
                      newPreferences.push(preference.id);
                    } else {
                      newPreferences.splice(index, 1);
                    }
                    updateFormData("preferences", newPreferences);
                  }}
                >
                  {preference.icon}
                  {preference.name}
                </button>
              ))}
            </div>

            <div className="mt-6 bg-gray-50 p-5 rounded-lg border border-gray-100 max-w-md mx-auto">
              <p className="text-body text-gray-700 mb-3 text-center font-medium">
                Anything specific about your preferences?
              </p>
              <textarea
                placeholder="e.g., I want to focus on hidden gems and local cuisine"
                value={formData.customNotes}
                onChange={(e) => updateFormData("customNotes", e.target.value)}
                className="w-full min-h-[80px] p-3 rounded-md border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-700"
              />
            </div>

            <div className="flex justify-center">
              <div className="inline-flex items-center text-primary bg-primary/5 px-4 py-2 rounded-lg border border-primary/20">
                <Info className="h-4 w-4 mr-2" />
                <span className="text-small">
                  Select at least one preference to continue
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Step content not implemented yet</div>;
    }
  };
  const canProceed = () => {
    switch (currentStep) {
      case "destination":
        return !!formData.destination;
      case "duration":
        return !!formData.duration;
      case "preferences":
        return formData.preferences.length > 0;
      case "mustDoAvoid":
        return true; // Optional step
      case "accommodation":
        return !!formData.accommodation;
      case "paceStructure":
        return !!formData.pace && !!formData.structure;
      case "budget":
        return !!formData.budget;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen flex flex-col ">
      <header className="bg-white border-b p-4">
        <h1 className="text-xl font-bold">Plan Your Trip</h1>
        <div className="text-sm text-gray-500">
          Step {steps.indexOf(currentStep) + 1} of {steps.length}
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">{renderStepContent()}</div>
        <div>
          Current step: {currentStep}
          {/* Step content will go here */}
        </div>
      </main>

      <footer className="bg-white border-t p-4 flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStep === steps[0]}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={goToNextStep}
          disabled={!canProceed() || currentStep === steps[steps.length - 1]}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </footer>
    </div>
  );
}

export default CreateTripNew;
