import React from "react";
import coverImage from "../../assets/cover-image.jpeg";
function Hero() {
  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0">
        <img
          src={coverImage} // Replace with your image path
          alt="Travel Background"
          className="w-full h-full object-cover"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Hero Content */}
      <div className="relative h-full flex flex-col items-center pt-32">
        {/* Hero Text */}
        <div className="text-center text-white mb-20">
          <h1 className="text-h1 font-bold mb-4">Your Journey, Your Rhythm</h1>
          <p className="text-h3">
            Create personalized travel experiences that match your pace
          </p>
        </div>
        {/* Floating Form Card */}
        <div className="w-full max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg">
            {/* Main Trip Details Row */}
            <div className="p-6 border-b border-gray-100">
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2">
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
            <div className="px-6 py-4 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Pace:</span>
                    <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary">
                      Balanced
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      Activity Level:
                    </span>
                    <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary">
                      Moderate
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Start Time:</span>
                    <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary">
                      Early Bird
                    </span>
                  </div>
                </div>
                <button className="text-primary hover:text-primary-dark text-sm">
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
