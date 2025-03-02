import React, { useState } from "react";
import { Button } from "../ui/button";
import { Calendar, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Badge } from "../ui/badge";
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
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Where are you headed?</h2>
              <p className="text-gray-600">
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
                      borderRadius: "0.5rem",
                      border: "1px solid #e2e8f0",
                    }),
                  },
                }}
              />
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Popular destinations:</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Tokyo, Japan", "Paris, France", "Bali, Indonesia"].map(
                  (place) => (
                    <Badge
                      key={place}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-100"
                      onClick={() => {
                        // Mock the Google Places result
                        updateFormData("destination", {
                          label: place,
                          value: place,
                        });
                      }}
                    >
                      {place}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </div>
        );

      case "duration":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">How long are you staying?</h2>
              <p className="text-gray-600">
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
                <div
                  key={option.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:shadow-md ${
                    formData.duration === option.value
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => updateFormData("duration", option.value)}
                >
                  <div className="flex flex-col items-center justify-center">
                    {option.icon}
                    <h3 className="mt-2 font-medium">{option.label}</h3>
                    <p className="text-xs text-gray-500">
                      {option.value === "10+"
                        ? "10+ days"
                        : `${option.value} days`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center space-y-2 max-w-xs mx-auto">
              <p className="text-sm text-center">
                Or enter a specific number of days
              </p>
              <Input
                type="number"
                placeholder="Number of days"
                min="1"
                max="30"
                value={formData.duration === "10+" ? "" : formData.duration}
                onChange={(e) => updateFormData("duration", e.target.value)}
                className="w-full text-center"
              />
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
    <div className="min-h-screen flex flex-col">
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
