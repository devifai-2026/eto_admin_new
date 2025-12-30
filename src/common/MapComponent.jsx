import React, { useState, useEffect } from "react";
import markerIcon from "../../images/rikshaw.png";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const MapComponent = ({ socket, rideId, adminId }) => {
  const [position, setPosition] = useState(null);
  const [showInfo, setShowInfo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Environment variable theke API key neoa
  const apiKey = "AIzaSyADoCI2hyTYNI3jXfG4jRZzVu0qdMMEH4Q";

  useEffect(() => {
    if (!socket) {
      setError("Socket connection not available");
      setLoading(false);
      return;
    }

    const emitLocationRequest = () => {
      try {
        socket.emit("getDriverLocationByRideId", { rideId, adminId });
        console.log("Location request emitted for rideId:", rideId);
      } catch (err) {
        console.error("Error emitting location request:", err);
        setError("Failed to request location");
      }
    };

    if (socket.connected) {
      emitLocationRequest();
    } else {
      socket.on("connect", emitLocationRequest);
    }

    const handleLocationResponse = (data) => {
      console.log("Location response received:", data);

      if (
        data.success &&
        data.location &&
        Array.isArray(data.location.coordinates)
      ) {
        const [lng, lat] = data.location.coordinates;
        setPosition({ lat, lng });
        setShowInfo(true);
        setLoading(false);
        console.log("Position updated:", { lat, lng });
      } else if (data.message) {
        setError(data.message);
        setLoading(false);
      }
    };

    socket.on("driverLocationForAdmin", handleLocationResponse);

    // Cleanup
    return () => {
      socket.off("driverLocationForAdmin", handleLocationResponse);
      socket.off("connect", emitLocationRequest);
    };
  }, [socket, rideId, adminId]);

  if (loading) {
    return (
      <div
        style={containerStyle}
        className="flex items-center justify-center bg-gray-100 dark:bg-gray-700"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Fetching driver location...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={containerStyle}
        className="flex items-center justify-center bg-gray-100 dark:bg-gray-700"
      >
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
            Error
          </p>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <APIProvider apiKey={apiKey}>
        {position ? (
          <Map
            defaultCenter={position}
            defaultZoom={15}
            mapId="DEMO_MAP_ID"
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Marker
              position={position}
              icon={{
                url: markerIcon,
                scaledSize: new window.google.maps.Size(60, 40),
              }}
              onClick={() => setShowInfo(true)}
              title={`Driver Location: ${position.lat.toFixed(
                4
              )}, ${position.lng.toFixed(4)}`}
            />
          </Map>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-700">
            <div className="text-center">
              <div className="animate-pulse">
                <p className="text-gray-600 dark:text-gray-300">
                  Unable to fetch driver location
                </p>
              </div>
            </div>
          </div>
        )}
      </APIProvider>
    </div>
  );
};

export default MapComponent;
