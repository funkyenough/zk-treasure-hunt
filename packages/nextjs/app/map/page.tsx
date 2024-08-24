"use client";

import React, { useEffect } from "react";

/// <reference types="@types/google.maps" />

export default function Page() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&language=ja`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        const map = new window.google.maps.Map(document.getElementById("map")!, {
          center: { lat: 35.681236, lng: 139.767125 }, // 東京駅の座標
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
        });

        // 始点と終点の座標を指定
        const start = { lat: 35.681236, lng: 139.767125 }; // 東京駅
        const end = { lat: 35.689487, lng: 139.691711 }; // 新宿駅

        // 矢印のアイコンを設定
        const lineSymbol = {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        };

        // Polylineを作成して、矢印を設定
        const line = new window.google.maps.Polyline({
          path: [start, end],
          icons: [
            {
              icon: lineSymbol,
              offset: "100%", // 矢印を線の終点に配置
            },
          ],
          strokeColor: "#FF0000", // 線の色を赤に設定
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });

        // 地図にPolylineを表示
        line.setMap(map);
      } else {
        console.error("Google Maps API failed to load.");
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <div id="map" style={{ height: "100vh", width: "100vw" }} />;
}
