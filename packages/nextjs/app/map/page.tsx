"use client";

import React, { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// Function to transform coordinates to integers
const transformCoordinatesToIntegers = (latitude: number, longitude: number) => {
  const manipulatedLat = (latitude + 90) % 180;
  const manipulatedLon = (longitude + 180) % 360;

  const finalLat = Math.floor(manipulatedLat * Math.pow(10, 6));
  const finalLon = Math.floor(manipulatedLon * Math.pow(10, 6));

  return { latitude: finalLat, longitude: finalLon };
};

export default function GeolocationMapPage() {
  const [latitude, setLatitude] = useState("???");
  const [longitude, setLongitude] = useState("???");
  const [errorMessage, setErrorMessage] = useState("");
  const [transformedCoordinates, setTransformedCoordinates] = useState({ latitude: 0, longitude: 0 });

  const { writeContractAsync: writeYourContractAsync, isMining } = useScaffoldWriteContract("zkTreasure");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&language=ja`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = initializeMap;

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    if (window.google) {
      const map = new window.google.maps.Map(document.getElementById("map")!, {
        center: { lat: 35.681236, lng: 139.767125 },
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: true,
      });

      const start = { lat: 35.681236, lng: 139.767125 };
      const end = { lat: 35.689487, lng: 139.691711 };

      const lineSymbol = {
        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      };

      const line = new window.google.maps.Polyline({
        path: [start, end],
        icons: [
          {
            icon: lineSymbol,
            offset: "100%",
          },
        ],
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });

      line.setMap(map);
    } else {
      console.error("Google Maps API failed to load.");
    }
  };

  const getLocation = () => {
    console.log("getLocation function called");

    if (typeof window === "undefined") {
      console.log("Running on server side, geolocation not available");
      setErrorMessage("This function is not available server-side.");
      return;
    }

    if (!("geolocation" in navigator)) {
      console.log("Geolocation not supported");
      setErrorMessage("Geolocation is not supported by this browser.");
      return;
    }

    console.log("Requesting geolocation...");
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log("Geolocation success:", position);

        const finalPoint = transformCoordinatesToIntegers(position.coords.latitude, position.coords.longitude);

        console.log("Transformed Latitude:", finalPoint.latitude);
        console.log("Transformed Longitude:", finalPoint.longitude);

        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        setTransformedCoordinates(finalPoint);
        setErrorMessage("");
      },
      error => {
        console.error("Geolocation error:", error);
        let errorMsg;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "User denied the request for Geolocation.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMsg = "The request to get user location timed out.";
            break;
          default:
            errorMsg = "An error occurred while retrieving location.";
        }
        setErrorMessage(errorMsg);
        alert(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  };

  const postCoordinates = async () => {
    if (transformedCoordinates.latitude === 0 && transformedCoordinates.longitude === 0) {
      setErrorMessage("Please get your location first before posting.");
      return;
    }

    try {
      await writeYourContractAsync({
        functionName: "createCoordinate",
        args: [0, transformedCoordinates.latitude, transformedCoordinates.longitude],
        value: parseEther("0"), // Adjust if the function is payable
      });
      console.log("Coordinates posted successfully");
      setErrorMessage(""); // Clear any previous errors
    } catch (e) {
      console.error("Error posting coordinates:", e);
      setErrorMessage("Failed to post coordinates. Please try again.");
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <div id="map" style={{ height: "100%", width: "100%" }} />

      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          padding: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          borderRadius: "5px",
        }}
      >
        <p>緯度：{latitude}</p>
        <p>経度：{longitude}</p>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>

      <button
        onClick={getLocation}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        現在位置を取得する
      </button>
      <button
        onClick={postCoordinates}
        disabled={isMining}
        style={{
          position: "absolute",
          top: "60px",
          right: "10px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isMining ? "Posting..." : "現在の座標を投稿する"}
      </button>
    </div>
  );
}
