import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: 6.5244, // Lagos default
  lng: 3.3792,
};

export default function MapView({ pins, onMapClick, onMarkerClick }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12}
      center={center}
      onClick={onMapClick}
    >
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={{ lat: pin.lat, lng: pin.lng }}
          onClick={() => onMarkerClick(pin)}
        />
      ))}
    </GoogleMap>
  );
}
