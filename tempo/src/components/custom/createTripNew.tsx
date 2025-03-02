import React, { useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Badge } from "../ui/badge";
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

      // Add other cases later
      default:
        return <div>Step content not implemented yet</div>;
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
          disabled={currentStep === steps[steps.length - 1]}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </footer>
    </div>
  );
}

export default CreateTripNew;
