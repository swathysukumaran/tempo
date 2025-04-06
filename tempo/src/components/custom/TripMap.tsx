import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
interface TripData {
  _id: string;
  userId: string;
  tripDetails: {
    budget: "budget" | "moderate" | "luxury";
    location: {
      label?: string; // Making optional as it might be missing
      value?: string;
    };
    timeframe: string;
    narrative: string;
    preferences: string;
    transportation?: object; // Adding new field
  };
  generatedItinerary: {
    trip_name: string;
    destination: string;
    duration: string;
    travelers: string;
    cover_image_url?: string;
    hotels: {
      hotel_name: string;
      hotel_address: string;
      price: string;
      rating: number;
      description: string;
      hotel_image_url?: string;
    }[];
    itinerary: {
      [day: string]: {
        theme: string;
        best_time_to_visit: string;
        activities: {
          place_name: string;
          place_address: string;
          place_details: string;
          ticket_pricing: string;
          rating: number;
          time_slot: string;
          travel_time: string;
          place_image_url: string | null; // Updated to allow null
        }[];
      };
    };
  };
  createdAt: string;
  __v: number;
}

function TripMap({ tripData }: { tripData: TripData }) {
  const hotels = tripData.generatedItinerary.hotels;
  const itinerary = tripData.generatedItinerary.itinerary;
  const mapContainerStyle = {
    width: "100%",
    height: "500px",
  };

  const defaultCenter = {
    lat: 20.5937, // fallback center (India)
    lng: 78.9629,
  };
  const allMarkers: { name: string; address: string }[] = [];
  hotels.forEach((hotel) =>
    allMarkers.push({
      name: hotel.hotel_name,
      address: hotel.hotel_address,
    })
  );
  Object.values(itinerary).forEach((day) => {
    day.activities.forEach((act) =>
      allMarkers.push({
        name: act.place_name,
        address: act.place_address,
      })
    );
  });
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={6}
        center={defaultCenter}
      >
        {allMarkers.map((item, idx) => (
          <GeocodedMarker key={idx} name={item.name} address={item.address} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default TripMap;
