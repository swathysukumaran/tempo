import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface MarkerData {
  name: string;
  lat: number;
  lng: number;
}
interface TripMapProps {
  markers: MarkerData[];
}

const containerStyle = {
  width: "100%",
  height: "400px",
  orderRadius: "1rem",
};
const center = {
  lat: 20,
  lng: 0,
};
function TripMap({ markers }: TripMapProps) {
  console.log("Markers in map component", markers);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.VITE_GOOGLE_PLACE_API_KEY || "",
  });
  if (!isLoaded) return <div>Loading...</div>;
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={markers[0] || center}
      zoom={5}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={{ lat: marker.lat, lng: marker.lng }}
          title={marker.name}
        />
      ))}
    </GoogleMap>
  );
}

export default TripMap;
