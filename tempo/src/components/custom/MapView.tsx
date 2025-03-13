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
  isOpen: boolean;
  onClose: () => void;
  hotels: Hotel[];
  activities: ItineraryData;
  apiKey: string;
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

const GeocodeAddress = ({
  mapPoints,
  onGeocodeComplete,
}: {
  mapPoints: MapPoint[];
  onGeocodeComplete: (mapPoints: MapPoint[]) => void;
}) => {
  const geocodingLibrary = useMapsLibrary("geocoding");
  const [geocodedPoints, setGeocodedPoints] = useState<MapPoint[]>([]);
  useEffect(() => {
    if (!geocodingLibrary) {
      return;
    }
    const geocodedAddressed = async () => {
      const geocoder = new geocodingLibrary.Geocoder();
      const geocodedPointsResult = [...mapPoints];
      //   Default to Vancouver if geocoding fails
      const defaultLocation = { lat: 49.2827, lng: -123.1207 };
      for (let i = 0; i < mapPoints.length; i++) {
        const point = mapPoints[i];
        const searchAddress = `${point.name},$point.address`;
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
          geocodedPointsResult[i] = {
            ...point,
            position: defaultLocation,
          };
        }
      }
      setGeocodedPoints(geocodedPointsResult);
      onGeocodeComplete(geocodedPointsResult);
    };
    geocodeAddresses();
  })[geocodingLibrary, mapPoints, onGeocodeComplete]);
    return null;
};

function MapView() {
  const position = { lat: 53.54, lng: 10 };
  const [open, setOpen] = useState(false);

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height: "100vh", width: "100%" }}>
        <Map zoom={9} center={position} mapId={mapId}>
          <AdvancedMarker position={position} onClick={() => setOpen(true)}>
            <Pin
              background={"grey"}
              borderColor={"green"}
              glyphColor={"purple"}
            />
          </AdvancedMarker>

          {open && (
            <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
              <p>I'm in Hamburg</p>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}

export default MapView;
