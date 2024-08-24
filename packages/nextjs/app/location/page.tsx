"use client";

import React, { useState } from "react";
import Head from "next/head";

export default function GeolocationPage() {
  const [latitude, setLatitude] = useState("???");
  const [longitude, setLongitude] = useState("???");
  const [zkgeopoint, setZkgeopoint] = useState("???");
  const [proof, setProof] = useState("???");
  const [errorMessage, setErrorMessage] = useState("");

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
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        setZkgeopoint("Not implemented");
        setProof("Not implemented");
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

  return (
    <>
      <Head>
        <title>Geolocation Sample</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
          crossOrigin="anonymous"
        />
      </Head>

      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="mb-3">
            <button onClick={getLocation} className="btn btn-outline-primary btn-lg">
              現在位置を取得する
            </button>
          </div>
          <div>
            <p>
              緯度：<span>{latitude}</span>
              <span>度</span>
            </p>
            <p>
              経度：<span>{longitude}</span>
              <span>度</span>
            </p>
            <p>
              ZKGEOPOINT：<span>{zkgeopoint}</span>
              <span>単位</span>
            </p>
            <p>
              Proof：<span>{proof}</span>
              <span>単位</span>
            </p>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
          </div>
        </div>
      </div>

      <style jsx>{`
        .min-vh-100 {
          min-height: 100vh;
        }
      `}</style>
    </>
  );
}
