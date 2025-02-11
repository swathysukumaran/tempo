import React from "react";
import Lottie from "lottie-react";
import travelAnimationData from "../../assets/travel-loading-animation.json"; // You'll need to add this JSON file

interface TripLoadingAnimationProps {
  className?: string;
}

const TripLoadingAnimation: React.FC<TripLoadingAnimationProps> = ({
  className,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gray-50 ${className}`}
    >
      <div className="w-full max-w-md">
        <Lottie
          animationData={travelAnimationData}
          loop
          autoplay
          style={{ width: "70%", height: "auto" }}
          className="w-full h-auto mx-auto"
        />
        <h2 className="text-center text-h2 text-primary font-semibold mt-4">
          Crafting Your Perfect Trip...
        </h2>
        <p className="text-center text-sm text-gray-500 mt-2">
          Generating a personalized itinerary just for you
        </p>
      </div>
    </div>
  );
};

export default TripLoadingAnimation;
