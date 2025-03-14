import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY || "";
const mapId = import.meta.env.VITE_GOOGLE_MAP_ID || "";

interface Hotel {
  hotel_name: string;
  hotel_address: string;
  description: string;
  hotel_image_url?: string;
}

interface Activity {
  place_name: string;
  place_details: string;
  place_image_url?: string;
}

interface DayData {
  theme: string;
  best_time_to_visit: string;
  activities: Activity[];
}

interface ItineraryData {
  [day: string]: DayData;
}

interface MapViewProps {
  hotels: Hotel[];
  activities: ItineraryData;
  isVisible: boolean;
}

interface MapPoint {
  id: string;
  name: string;
  address: string;
  type: "hotel" | "activity";
  position?: { lat: number; lng: number };
  details: string;
  image?: string;
  day?: string;
}

// // Type definition for the Google Maps Geocoding response
// interface GeocodeResult {
//   results: {
//     geometry: {
//       location: {
//         lat: () => number;
//         lng: () => number;
//       };
//     };
//   }[];
// }

const GeocodeAddresses = ({
  mapPoints,
  onGeocodeComplete,
}: {
  mapPoints: MapPoint[];
  onGeocodeComplete: (mapPoints: MapPoint[]) => void;
}) => {
  const geocodingLibrary = useMapsLibrary("geocoding");

  useEffect(() => {
    if (!geocodingLibrary) {
      return;
    }

    const geocodeAddresses = async () => {
      const geocoder = new geocodingLibrary.Geocoder();
      const geocodedPointsResult = [...mapPoints];
      // Default to Vancouver if geocoding fails
      const defaultLocation = { lat: 49.2827, lng: -123.1207 };

      for (let i = 0; i < mapPoints.length; i++) {
        const point = mapPoints[i];
        const searchAddress = `${point.name}, ${point.address}`;

        try {
          const response = await geocoder.geocode({ address: searchAddress });
          if (response.results && response.results.length > 0) {
            const location = response.results[0].geometry.location;
            geocodedPointsResult[i] = {
              ...point,
              position: { lat: location.lat(), lng: location.lng() },
            };
          } else {
            geocodedPointsResult[i] = {
              ...point,
              position: defaultLocation,
            };
          }
        } catch (error) {
          console.error(`Error geocoding ${searchAddress}:`, error);
          geocodedPointsResult[i] = {
            ...point,
            position: defaultLocation,
          };
        }
      }

      onGeocodeComplete(geocodedPointsResult);
    };

    geocodeAddresses();
  }, [geocodingLibrary, mapPoints, onGeocodeComplete]);

  return null;
};

function MapView({ isVisible, hotels, activities }: MapViewProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapPoint | null>(null);
  const [geocodedPoints, setGeocodedPoints] = useState<MapPoint[]>([]);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  // Combine hotels and activities into a single array of map points
  const mapPoints: MapPoint[] = [
    ...hotels.map((hotel) => ({
      id: `hotel-${hotel.hotel_name}`,
      name: hotel.hotel_name,
      address: hotel.hotel_address,
      type: "hotel" as const,
      details: hotel.description,
      image: hotel.hotel_image_url,
    })),
    ...Object.entries(activities).flatMap(([day, dayData]) =>
      dayData.activities.map((activity) => ({
        id: `activity-${activity.place_name}`,
        name: activity.place_name,
        address: activity.place_details.split(".")[0],
        type: "activity" as const,
        details: activity.place_details,
        image: activity.place_image_url,
        day: day,
      }))
    ),
  ];

  const handleGeocodeComplete = (points: MapPoint[]) => {
    setGeocodedPoints(points);
    setMapLoaded(true);
  };

  return (
    <div
      className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${
        isVisible ? "h-[400px] opacity-100 mb-8" : "h-0 opacity-0"
      }`}
    >
      <div className="w-full h-full rounded-xl border border-gray-300 overflow-hidden shadow-lg">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={{ lat: 40.7128, lng: -74.006 }}
            defaultZoom={12}
            gestureHandling="cooperative"
            mapId={mapId}
            className="w-full h-full"
            // onLoad={() => console.log("Map loaded")}
          >
            <GeocodeAddresses
              mapPoints={mapPoints}
              onGeocodeComplete={handleGeocodeComplete}
            />

            {mapLoaded &&
              geocodedPoints.map(
                (point) =>
                  point.position && (
                    <AdvancedMarker
                      key={point.id}
                      position={point.position}
                      onClick={() => setSelectedMarker(point)}
                    >
                      <Pin
                        background={
                          point.type === "hotel" ? "#3b82f6" : "#ef4444"
                        }
                        borderColor={
                          point.type === "hotel" ? "#1d4ed8" : "#b91c1c"
                        }
                        glyphColor="#ffffff"
                      />
                    </AdvancedMarker>
                  )
              )}

            {selectedMarker && selectedMarker.position && (
              <InfoWindow
                position={selectedMarker.position}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-2 max-w-xs">
                  <h3 className="font-bold text-lg">{selectedMarker.name}</h3>
                  <p className="text-sm text-gray-700">
                    {selectedMarker.address}
                  </p>
                  {selectedMarker.day && (
                    <p className="text-sm text-indigo-600 font-medium mt-1">
                      {selectedMarker.day.replace("day", "Day ")}
                    </p>
                  )}
                  {selectedMarker.type === "hotel" && (
                    <p className="text-sm text-blue-600 font-medium mt-1">
                      Hotel
                    </p>
                  )}
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}

export default MapView;
