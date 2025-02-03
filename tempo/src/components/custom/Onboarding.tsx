import React, { useState } from "react";
import {
  Heart,
  Compass,
  Plane,
  Camera,
  TreePine,
  Music,
  Utensils,
} from "lucide-react";
import { Card } from "../ui/card";
function Onboarding() {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    pace: "",
    activities: [] as string[],
  });
  const steps = [
    {
      title: "How do you like to travel?",
      description: "Choose your preferred travel pace",
      field: "pace",
      options: [
        {
          id: "relaxed",
          label: "Take it Easy",
          icon: Heart,
          description: "Relaxed pace, plenty of free time",
        },
        {
          id: "balanced",
          label: "Balanced Mix",
          icon: Compass,
          description: "Mix of activities and downtime",
        },
        {
          id: "intense",
          label: "Adventure Packed",
          icon: Plane,
          description: "Full schedule, maximum experiences",
        },
      ],
    },
    {
      title: "What excites you most?",
      description: "Select activities you enjoy (choose multiple)",
      field: "activities",
      multiple: true,
      options: [
        {
          id: "culture",
          label: "Cultural",
          icon: Camera,
          description: "Museums, historical sites",
        },
        {
          id: "nature",
          label: "Nature",
          icon: TreePine,
          description: "Hiking, landscapes, outdoors",
        },
        {
          id: "entertainment",
          label: "Entertainment",
          icon: Music,
          description: "Shows, concerts, nightlife",
        },
        {
          id: "food",
          label: "Food",
          icon: Utensils,
          description: "Local cuisine, food tours",
        },
      ],
    },
  ];

  const currentStep = steps[step];

  const handleSelect = (value: string) => {
    if (currentStep.multiple) {
      // Handle multiple selection for activities
      setPreferences((prev) => ({
        ...prev,
        activities: prev.activities.includes(value)
          ? prev.activities.filter((item) => item !== value)
          : [...prev.activities, value],
      }));
    } else {
      // Handle single selection for pace
      setPreferences((prev) => ({
        ...prev,
        pace: value,
      }));
      // Auto advance for single selection
      if (step < steps.length - 1) {
        setStep((prev) => prev + 1);
      }
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
        <p className="text-gray-600 mb-6">{currentStep.description}</p>

        <div className="space-y-3">
          {currentStep.options.map((option) => {
            const Icon = option.icon;
            const isSelected = currentStep.multiple
              ? preferences.activities.includes(option.id)
              : preferences.pace === option.id;
            return (
              <button
                key={option.id}
                onClick={() => {
                  handleSelect(option.id);
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-200"
                }`}
              >
                <div className="flex items-center">
                  <Icon
                    className={`w-6 h-6 mr-3 ${
                      isSelected ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                  <div className="text-left">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-500">
                      {option.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Only show Next button for multiple selection */}
        {currentStep.multiple && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Onboarding;
