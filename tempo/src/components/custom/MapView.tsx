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

// Component to handle geocoding and map center
const MapController = ({
  mapPoints,
  onGeocodingComplete,
}: {
  mapPoints: MapPoint[];
  onGeocodingComplete: (
    points: MapPoint[],
    center: google.maps.LatLngLiteral
  ) => void;
}) => {
  const map = useMap();
  const geocodingLibrary = useMapsLibrary("geocoding");

  // Track if we've already geocoded these specific points
  const [isGeocoded, setIsGeocoded] = useState(false);

  useEffect(() => {
    if (!geocodingLibrary || !map || isGeocoded) {
      return;
    }

    const geocodeAddresses = async () => {
      const geocoder = new geocodingLibrary.Geocoder();
      const geocodedPointsResult = [...mapPoints];

      // Try to find main destination - prefer a hotel first
      const hotelPoints = mapPoints.filter((point) => point.type === "hotel");
      const pointToUseForCenter =
        hotelPoints.length > 0 ? hotelPoints[0] : mapPoints[0];

      // Default location if geocoding fails
      const defaultLocation = { lat: 49.2827, lng: -123.1207 }; // Vancouver
      let centerPosition = defaultLocation;

      // First geocode the main point we want to center on
      if (pointToUseForCenter) {
        const searchAddress = `${pointToUseForCenter.name}, ${pointToUseForCenter.address}`;
        try {
          const response = await geocoder.geocode({ address: searchAddress });
          if (response.results && response.results.length > 0) {
            const location = response.results[0].geometry.location;
            centerPosition = {
              lat: location.lat(),
              lng: location.lng(),
            };
          }
        } catch (error) {
          console.error(
            `Error geocoding main location ${searchAddress}:`,
            error
          );
        }
      }

      // Now geocode all the points
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
              position: centerPosition, // Use the center position as fallback
            };
          }
        } catch (error) {
          console.error(`Error geocoding ${searchAddress}:`, error);
          geocodedPointsResult[i] = {
            ...point,
            position: centerPosition, // Use the center position as fallback
          };
        }
      }

      // Move the map to the center position but keep zoom level as is
      map.panTo(centerPosition);

      onGeocodingComplete(geocodedPointsResult, centerPosition);
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
  const [mapCenter, setMapCenter] = useState({ lat: 49.2827, lng: -123.1207 }); // Default Vancouver

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

  const handleGeocodingComplete = (
    points: MapPoint[],
    center: google.maps.LatLngLiteral
  ) => {
    setGeocodedPoints(points);
    setMapCenter(center);
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
            center={mapCenter}
            zoom={13} // Fixed zoom level - adjust as needed
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
