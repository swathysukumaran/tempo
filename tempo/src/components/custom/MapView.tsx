import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMapsLibrary,
  useMap,
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
  ticket_pricing: string;
  rating: number;
  time_slot: string;
  travel_time: string;
  place_image_url: string | null;
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
  image?: string | null;
  day?: string;
}

// Component to handle geocoding and map bounds
const MapController = ({
  mapPoints,
  onGeocodingComplete,
}: {
  mapPoints: MapPoint[];
  onGeocodingComplete: (points: MapPoint[]) => void;
}) => {
  const map = useMap();
  const geocodingLibrary = useMapsLibrary("geocoding");

  // Track if we've already geocoded these specific points to prevent repeat geocoding
  const [isGeocoded, setIsGeocoded] = useState(false);

  useEffect(() => {
    if (!geocodingLibrary || !map || isGeocoded) {
      return;
    }

    const geocodeAddresses = async () => {
      const geocoder = new geocodingLibrary.Geocoder();
      const geocodedPointsResult = [...mapPoints];

      // Try to find a destination-related search term from the first hotel or activity
      let destinationSearch = "";
      if (mapPoints.length > 0) {
        const firstPoint = mapPoints[0];
        // Try to extract city name or region from the address
        const addressParts = firstPoint.address.split(",");
        if (addressParts.length > 1) {
          // Use the second part which often contains city/region
          destinationSearch = addressParts[1].trim();
        } else {
          destinationSearch = firstPoint.address;
        }
      }

      // Default location if geocoding fails
      let defaultLocation = { lat: 49.2827, lng: -123.1207 }; // Vancouver

      // Try to geocode the destination first to get a better default center
      if (destinationSearch) {
        try {
          const destResponse = await geocoder.geocode({
            address: destinationSearch,
          });
          if (destResponse.results && destResponse.results.length > 0) {
            const location = destResponse.results[0].geometry.location;
            defaultLocation = {
              lat: location.lat(),
              lng: location.lng(),
            };
          }
        } catch (error) {
          console.error(
            `Error geocoding destination ${destinationSearch}:`,
            error
          );
        }
      }

      for (let i = 0; i < mapPoints.length; i++) {
        const point = mapPoints[i];
        const searchAddress = `${point.name}, ${point.address}`;

        try {
          const response = await geocoder.geocode({ address: searchAddress });
          if (response.results && response.results.length > 0) {
            const location = response.results[0].geometry.location;
            const position = {
              lat: location.lat(),
              lng: location.lng(),
            };

            geocodedPointsResult[i] = {
              ...point,
              position: position,
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

      // After geocoding, fit the map to show all points
      if (geocodedPointsResult.length > 0) {
        const validPoints = geocodedPointsResult.filter((p) => p.position);
        if (validPoints.length > 0) {
          // Create bounds object to fit the map to all markers
          const bounds = new google.maps.LatLngBounds();
          validPoints.forEach((point) => {
            if (point.position) {
              bounds.extend(point.position);
            }
          });

          // Set initial bounds once
          map.fitBounds(bounds);

          // Add a very small padding to the bounds
          const padFactor = 0.05; // 5% padding on each side
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          const latDiff = (ne.lat() - sw.lat()) * padFactor;
          const lngDiff = (ne.lng() - sw.lng()) * padFactor;

          const newBounds = new google.maps.LatLngBounds(
            { lat: sw.lat() - latDiff, lng: sw.lng() - lngDiff },
            { lat: ne.lat() + latDiff, lng: ne.lng() + lngDiff }
          );

          map.fitBounds(newBounds);

          // Add listener to prevent auto zoom when map is interacted with
          google.maps.event.addListenerOnce(map, "bounds_changed", () => {
            // Add event listener for zoom_changed to maintain user control
            google.maps.event.addListener(map, "zoom_changed", () => {
              // This prevents bounds from being re-applied
              // The user now has control over the zoom
            });
          });
        }
      }

      onGeocodingComplete(geocodedPointsResult);
      setIsGeocoded(true);
    };

    geocodeAddresses();
  }, [geocodingLibrary, map, mapPoints, onGeocodingComplete, isGeocoded]);

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
      dayData.activities.map((activity: Activity) => ({
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

  const handleGeocodingComplete = (points: MapPoint[]) => {
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
            gestureHandling="cooperative"
            mapId={mapId}
            className="w-full h-full"
          >
            <MapController
              mapPoints={mapPoints}
              onGeocodingComplete={handleGeocodingComplete}
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
