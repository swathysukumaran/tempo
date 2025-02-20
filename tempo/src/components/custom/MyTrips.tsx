import React from "react";
import { Clock, Users, Wallet, MapPin } from "lucide-react";
function MyTrips() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Trips</h1>
          <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Create New Trip
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer overflow-hidden">
            <div
              className="h-48 bg-cover bg-center"
              style={{
                backgroundImage: `url(
                  "/default-trip-image.jpg"
                })`,
              }}
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                trip_name
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  description
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock size={16} className="mr-2" />
                  days
                </div>
                <div className="flex items-center text-gray-600">
                  <Users size={16} className="mr-2" />
                  travelers
                </div>
                <div className="flex items-center text-gray-600">
                  <Wallet size={16} className="mr-2" />
                  tripDetails.budget
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">988</span>
                <span className="text-sm font-medium text-primary">pace</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyTrips;
