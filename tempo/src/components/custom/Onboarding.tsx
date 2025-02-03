import React, { useState } from "react";
import { Heart, Compass, Plane } from "lucide-react";
import { Card } from "../ui/card";
function Onboarding() {
  const [preferences, setPreferences] = useState({
    pace: "",
  });
  const options = [
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
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-2">How do you like to travel?</h2>
        <p className="text-gray-600 mb-6">Choose your preferred travel pace</p>

        <div className="space-y-3">
          {options.map((option) => {
            const Icon = option.icon;
            const isSelected = preferences.pace === option.id;

            return (
              <button
                key={option.id}
                onClick={() =>
                  setPreferences({ ...preferences, pace: option.id })
                }
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
      </Card>
    </div>
  );
}

export default Onboarding;
