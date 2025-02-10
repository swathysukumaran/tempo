import React from "react";

function Hero() {
  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0">
        <img
          src="/hero-bg.jpg" // Replace with your image path
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
        <div className="w-full max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Destination */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Where would you like to go?
                </label>
                <input
                  type="text"
                  placeholder="Enter destination"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Trip Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Number of days"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <select className="w-full p-3 rounded-lg border border-gray-200 focus:ring-primary focus:border-primary">
                  <option value="">Select budget range</option>
                  <option value="budget">Budget Friendly</option>
                  <option value="moderate">Moderate</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="col-span-2">
                <button className="w-full bg-secondary hover:bg-secondary-dark text-white py-3 rounded-lg transition-colors">
                  Create Your Trip
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
