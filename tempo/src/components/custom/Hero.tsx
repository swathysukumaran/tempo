import React from "react";
import coverImage from "../../assets/cover.jpg";
function Hero() {
  return (
    <div className="min-h-screen  relative">
      <div className="absolute inset-0">
        <img
          src={coverImage} // Replace with your image path
          alt="Travel Background"
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Hero Content */}
      <div className="relative h-full flex flex-col items-center pt-16 md:pt-32">
        {/* Hero Text */}
        <div className="text-center text-white px-4 mb-12 md:mb-20">
          <h1 className="text-h2 md:text-h1 font-bold mb-3 md:mb-4">
            Your Journey, Your Rhythm
          </h1>
          <p className="text-body md:text-h3">
            Create personalized travel experiences that match your pace
          </p>
        </div>
        {/* Floating Form Card */}
        <div className="w-full px-4 md:max-w-5xl md:mx-auto">
          <div className="bg-white w-full px-4 md:max-w-5xl md:mx-auto">
            {/* Main Trip Details Row */}
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex flex-col space-y-4 md:space-y-0 md:grid md:grid-cols-5 md:gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Where would you like to go?"
                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    placeholder="Days"
                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <select className="w-full p-3 rounded-lg border border-gray-200 focus:ring-primary focus:border-primary">
                    <option value="">Budget</option>
                    <option value="budget">Budget Friendly</option>
                    <option value="moderate">Moderate</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
                <div>
                  <button className="w-full bg-secondary hover:bg-secondary-dark text-white p-3 rounded-lg transition-colors">
                    Create Trip
                  </button>
                </div>
              </div>
            </div>

            {/* Preferences Row */}
            <div className="px-4 py-3 md:px-6 md:py-4 bg-gray-50/50">
              <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
                <div className="flex overflow-x-auto pb-2 md:pb-0 gap-3 md:gap-4 hide-scrollbar">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm text-gray-500">Pace:</span>
                    <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary whitespace-nowrap">
                      Balanced
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm text-gray-500">
                      Activity Level:
                    </span>
                    <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary whitespace-nowrap">
                      Moderate
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm text-gray-500">Start Time:</span>
                    <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary whitespace-nowrap">
                      Early Bird
                    </span>
                  </div>
                </div>
                <button className="text-primary hover:text-primary-dark text-sm whitespace-nowrap">
                  Modify Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
