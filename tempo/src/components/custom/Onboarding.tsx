import React, { useEffect, useState } from "react";
import {
  Heart,
  Compass,
  Plane,
  Camera,
  TreePine,
  Music,
  Utensils,
  Clock,
  Moon,
  Sun,
  AlertCircle,
  Coffee,
} from "lucide-react";
import { Card } from "../ui/card";
import { API_URL } from "@/config/api";
function Onboarding() {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    pace: "",
    activities: [] as string[],
    activityLevel: "",
    startTime: "",
    foodApproach: "",
    diningStyles: [] as string[],
    avoidances: [] as string[],
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
    {
      title: "What's your activity level?",
      description: "Choose how active you want to be",
      field: "activityLevel",
      options: [
        {
          id: "low",
          label: "Low Impact",
          icon: Heart,
          description: "Mostly sightseeing, minimal walking",
        },
        {
          id: "moderate",
          label: "Moderate",
          icon: Clock,
          description: "Regular walking tours, some activities",
        },
        {
          id: "high",
          label: "High Energy",
          icon: Plane,
          description: "Hiking, sports, adventure activities",
        },
      ],
    },
    {
      title: "When do you start your day?",
      description: "Choose your preferred start time",
      field: "startTime",
      options: [
        {
          id: "early",
          label: "Early Bird",
          icon: Sun,
          description: "Start before 7 AM",
        },
        {
          id: "mid",
          label: "Mid Morning",
          icon: Coffee,
          description: "Start between 7-9 AM",
        },
        {
          id: "late",
          label: "Late Starter",
          icon: Moon,
          description: "Start after 9 AM",
        },
      ],
    },
    {
      title: "What's your food style?",
      description: "Choose your approach to food while traveling",
      field: "foodApproach",
      options: [
        {
          id: "adventurous",
          label: "Adventurous",
          icon: Utensils,
          description: "Love trying local specialties",
        },
        {
          id: "mixed",
          label: "Flexible",
          icon: Coffee,
          description: "Mix of local and familiar",
        },
        {
          id: "cautious",
          label: "Conservative",
          icon: Heart,
          description: "Prefer familiar foods",
        },
      ],
    },
    {
      title: "Dining preferences",
      description: "Select your preferred dining styles (choose multiple)",
      field: "diningStyles",
      multiple: true,
      options: [
        {
          id: "local",
          label: "Local Restaurants",
          icon: Utensils,
          description: "Authentic local establishments",
        },
        {
          id: "street",
          label: "Street Food",
          icon: Coffee,
          description: "Food markets and street vendors",
        },
        {
          id: "fine",
          label: "Fine Dining",
          icon: Utensils,
          description: "Upscale restaurants",
        },
        {
          id: "casual",
          label: "Casual Dining",
          icon: Coffee,
          description: "Casual cafes and eateries",
        },
      ],
    },
    {
      title: "Any preferences to avoid?",
      description: "Select what you'd prefer to avoid (choose multiple)",
      field: "avoidances",
      multiple: true,
      options: [
        {
          id: "crowds",
          label: "Crowds",
          icon: AlertCircle,
          description: "Busy tourist spots",
        },
        {
          id: "early",
          label: "Early Mornings",
          icon: Sun,
          description: "Early morning activities",
        },
        {
          id: "night",
          label: "Late Nights",
          icon: Moon,
          description: "Late night activities",
        },
        {
          id: "walking",
          label: "Long Walks",
          icon: Clock,
          description: "Extended walking tours",
        },
      ],
    },
  ];
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await fetch(`${API_URL}/onboarding/status`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        console.log("Loaded progress:", data);
        if (data?.temporaryPreferences) {
          setPreferences(data.temporaryPreferences);
          if (data.currentStep) {
            setStep(data.currentStep);
          }
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    };

    loadProgress();
  }, []);

  const currentStep = steps[step];

  const handleSelect = (value: string) => {
    if (currentStep.multiple) {
      // Handle multiple selection for activities
      setPreferences((prev) => ({
        ...prev,
        [currentStep.field]: (
          prev[currentStep.field as keyof typeof preferences] as string[]
        ).includes(value)
          ? (
              prev[currentStep.field as keyof typeof preferences] as string[]
            ).filter((item: string) => item !== value)
          : [
              ...(prev[
                currentStep.field as keyof typeof preferences
              ] as string[]),
              value,
            ],
      }));
    } else {
      // Handle single selection for pace
      setPreferences((prev) => ({
        ...prev,
        [currentStep.field]: value,
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
    } else {
      // Handle completion
      console.log("Completed:", preferences);
    }
  };
  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
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

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Back
          </button>
          {currentStep.multiple && (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Next
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Onboarding;
