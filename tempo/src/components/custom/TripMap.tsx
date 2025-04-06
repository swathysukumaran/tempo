import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { geocodeAddress } from "@/lib/geocode";

interface MarkerData {
  name: string;
  lat: number;
  lng: number;
}

interface TripData {
  _id: string;
  userId: string;
  tripDetails: {
    budget: "budget" | "moderate" | "luxury";
    location: {
      label?: string;
      value?: string;
    };
    timeframe: string;
    narrative: string;
    preferences: string;
    transportation?: object;
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
          place_image_url: string | null;
        }[];
      };
    };
  };
  createdAt: string;
  __v: number;
}

function TripMap({ tripData }: { tripData: TripData }) {
  console.log("Trip Data in map:", tripData);
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

  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const fetchCoordinates = async () => {
    const allMarkers: MarkerData[] = [];

    // Geocode hotels
    for (const hotel of hotels) {
      try {
        const coords = (await geocodeAddress(hotel.hotel_address)) as {
          lat: number;
          lng: number;
        };
        allMarkers.push({
          name: hotel.hotel_name,
          lat: coords.lat,
          lng: coords.lng,
        });
      } catch {
        console.warn("Error geocoding hotel:", hotel.hotel_name);
      }
    }

    // Geocode activities
    for (const day of Object.values(itinerary)) {
      for (const activity of day.activities) {
        try {
          const coords = (await geocodeAddress(activity.place_address)) as {
            lat: number;
            lng: number;
          };
          allMarkers.push({
            name: activity.place_name,
            lat: coords.lat,
            lng: coords.lng,
          });
        } catch {
          console.warn("Error geocoding activity:", activity.place_name);
        }
      }
    }

    setMarkers(allMarkers);
  };

  // Fetch coordinates when component mounts
  useEffect(() => {
    fetchCoordinates();
  }, [tripData]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={6}
      center={defaultCenter}
    >
      {/* Render markers for all hotels and activities */}
      {markers.map((item, idx) => (
        <Marker
          key={idx}
          position={{ lat: item.lat, lng: item.lng }}
          title={item.name}
          googleMapsApiKey={API_KEY}
        />
      ))}
    </GoogleMap>
  );
}

export default TripMap;
