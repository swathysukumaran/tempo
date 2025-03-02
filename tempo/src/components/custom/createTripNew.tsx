import React, { useState } from "react";
import { Button } from "../ui/button";
import { Calendar, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                {
                  id: "weekend",
                  label: "Weekend",
                  value: "2",
                  icon: <Calendar className="h-5 w-5" />,
                },
                {
                  id: "short",
                  label: "Short Trip",
                  value: "4",
                  icon: <Calendar className="h-5 w-5" />,
                },
                {
                  id: "week",
                  label: "One Week",
                  value: "7",
                  icon: <Calendar className="h-5 w-5" />,
                },
                {
                  id: "long",
                  label: "Extended",
                  value: "10+",
                  icon: <Calendar className="h-5 w-5" />,
                },
              ].map((option) => (
                <button
                  key={option.id}
                  className={`p-4 border rounded-lg transition-all hover:border-primary/40 ${
                    formData.duration === option.value
                      ? "border-primary bg-primary/5 text-primary-dark"
                      : "border-gray-100 text-gray-700"
                  }`}
                  onClick={() => updateFormData("duration", option.value)}
                >
                  <div className="flex flex-col items-center justify-center">
                    <div
                      className={`p-2 rounded-full mb-2 ${
                        formData.duration === option.value
                          ? "bg-primary/10"
                          : "bg-gray-50"
                      }`}
                    >
                      {option.icon}
                    </div>
                    <h3 className="font-medium">{option.label}</h3>
                    <p className="text-small mt-1 text-gray-500">
                      {option.value === "10+"
                        ? "10+ days"
                        : `${option.value} days`}
                    </p>
                  </div>
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

      // Add other cases later
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
