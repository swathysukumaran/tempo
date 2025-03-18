import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import travelAnimationData from "../../assets/travel-loading-animation.json"; // Your JSON file

interface TripLoadingAnimationProps {
  className?: string;
}

const TripLoadingAnimation: React.FC<TripLoadingAnimationProps> = ({
  className,
}) => {
  const messages = [
    "Finding your destination...",
    "Crafting your personalized itinerary...",
    "Discovering hidden gems...",
    "Selecting the best accommodations...",
    "Planning your daily adventures...",
    "Adding local experiences...",
    "Optimizing travel routes...",
    "Finalizing your travel plan...",
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 6000); // Change message every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [messages.length]);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gray-50 ${className}`}
    >
      <div className="w-full max-w-md">
        <Lottie
          animationData={travelAnimationData}
          loop
          autoplay
          style={{ width: "50%", height: "auto" }} // Reduced size
          className="w-full h-auto mx-auto"
        />
        <h2 className="text-center text-h2 text-primary font-semibold mt-4">
          {messages[messageIndex]} {/* Dynamic message */}
        </h2>
      </div>
    </div>
  );
};

export default TripLoadingAnimation;
