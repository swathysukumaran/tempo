import React from "react";
import {
  Plane,
  Utensils,
  Compass,
  Sun,
  Moon,
  TreePine,
  Camera,
  Music,
  Heart,
  Coffee,
} from "lucide-react";
function Onboarding() {
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
      title: "When are you most active?",
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
          label: "Night Owl",
          icon: Moon,
          description: "Start after 9 AM",
        },
      ],
    },
    {
      title: "Food Preferences",
      description: "What's your approach to food while traveling?",
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
  ];

  return (
    <div>
      <h1>Onboarding...</h1>
    </div>
  );
}

export default Onboarding;
