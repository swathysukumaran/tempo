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
  type: 'hotel' | 'activity';
  position?: { lat: number; lng: number };
  details: string;
  image?: string;
  day?: string;
}

interface GeocodeLocationsProps {
  hotels: Hotel[];
  activities: any[]; 
  onLocationsReady: (locations: any[]) => void; // Replace 'any' with the appropriate type if known
}

const GeocodeLocations = ({ hotels, activities, onLocationsReady }: GeocodeLocationsProps) => {
  const geocodingLibrary = useMapsLibrary("geocoding");
  useEffect(() => {
    if(!geocodingLibrary || !hotels || !activities) return;

    const geocoder=new geocodingLibrary.Geocoder();
    const allLocations = [];
    const newBounds = new google.maps.LatLngBounds();
    let pendingGeocodes=0;
  }
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
