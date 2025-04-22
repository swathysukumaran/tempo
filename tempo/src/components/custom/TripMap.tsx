import React from "react";
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

const containerStyle={
    width:'100%',
    height:'400px',
    orderRadius:'1rem'
}
const center={
    lat:20,lng:0
};
function TripMap({markers}:TripMapProps) {
  return (
    
  );
}

export default TripMap;
