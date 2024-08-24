"use client";

/// <reference types="@types/google.maps" />
import React, { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&language=ja`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        // Google Maps API が正しくロードされた場合に地図を作成
        const map = new window.google.maps.Map(document.getElementById("map")!, {
          center: { lat: 35.681236, lng: 139.767125 }, // 東京駅の座標を中心にする
          zoom: 15,
          disableDefaultUI: true, // デフォルトのUIを無効にする
          zoomControl: true, // ズームコントロールは有効にする
        });

        // 矢印の先端（ポリラインのアイコン）を設定
        const lineSymbol = {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW, // 矢印の形状を指定
        };

        //矢印の色
        enum ArrowColors {
          Closer,
          Further,
          Treasure,
        }

        // 二次元配列を値に持つ連想配列を宣言
        const arrowPaths: { [key: string]: { lat: number; lng: number }[][] } = {};

        // 配列に値を追加
        arrowPaths["route1"] = [
          [
            { lat: 35.681236, lng: 139.767125 },
            { lat: 35.689487, lng: 139.691711 },
          ], // 東京駅から新宿駅
          [
            { lat: 35.681236, lng: 139.767125 },
            { lat: 35.658581, lng: 139.745433 },
          ], // 東京駅から東京タワー
          [
            { lat: 35.681236, lng: 139.767125 },
            { lat: 35.710062, lng: 139.8107 },
          ], // 東京駅から上野駅
          [
            { lat: 35.681236, lng: 139.767125 },
            { lat: 35.654961, lng: 139.748019 },
          ], // 東京駅から六本木駅
          [
            { lat: 35.681236, lng: 139.767125 },
            { lat: 35.673261, lng: 139.710074 },
          ], // 東京駅から渋谷駅
        ];

        arrowPaths["route2"] = [
          [
            { lat: 35.689487, lng: 139.691711 },
            { lat: 35.693825, lng: 139.703356 },
          ], // 新宿駅から新大久保駅
          [
            { lat: 35.689487, lng: 139.691711 },
            { lat: 35.685176, lng: 139.752799 },
          ], // 新宿駅から銀座駅
          [
            { lat: 35.689487, lng: 139.691711 },
            { lat: 35.702069, lng: 139.775327 },
          ], // 新宿駅から浅草駅
          [
            { lat: 35.689487, lng: 139.691711 },
            { lat: 35.669723, lng: 139.699794 },
          ], // 新宿駅から代々木駅
          [
            { lat: 35.689487, lng: 139.691711 },
            { lat: 35.658517, lng: 139.701333 },
          ], // 新宿駅から原宿駅
        ];

        // 特定のポイントとその次のポイントの間に矢印を作成する関数
        const createArrow = function (key: string, index: number, colorIndex: number) {
          const paths = arrowPaths[key];
          if (paths && paths[index] && paths[index + 1]) {
            const path = [paths[index][0], paths[index][1]]; // 指定されたインデックスのポイントとその次のポイント

            // colorIndexに応じて矢印の色を設定
            let strokeColor;
            switch (colorIndex) {
              case ArrowColors.Closer:
                strokeColor = "#00FF00"; // 緑色
                break;
              case ArrowColors.Further:
                strokeColor = "#FF0000"; // 赤色
                break;
              case ArrowColors.Treasure:
                strokeColor = "#FFFF00"; // 黄色
                break;
              default:
                strokeColor = "#FF0000"; // デフォルトは赤色
                break;
            }

            const line = new window.google.maps.Polyline({
              path: path, // パスに沿って矢印付きの線を描く
              icons: [
                {
                  icon: lineSymbol, // 矢印のアイコンを設定
                  offset: "100%", // 矢印を線の末端に配置
                },
              ],
              strokeColor: strokeColor, // 指定された色で線の色を設定
              strokeOpacity: 1.0, // 線の透明度
              strokeWeight: 4, // 線の太さ
            });
            line.setMap(map); // 地図上にポリラインを表示
          } else {
            console.error(`Invalid index or path not found for key: ${key}`); // パスが見つからない場合や無効なインデックスの場合のエラーメッセージ
          }
        };

        // "route1" の 0 番目と 1 番目のポイントに対して矢印を作成（緑色）
        createArrow("route1", 3, ArrowColors.Closer);

        // "route2" の 0 番目と 1 番目のポイントに対して矢印を作成（赤色）
        createArrow("route2", 2, ArrowColors.Further);

        // "route1" の 1 番目と 2 番目のポイントに対して矢印を作成（黄色）
        createArrow("route1", 1, ArrowColors.Treasure);
      } else {
        console.error("Google Maps API failed to load."); // APIロード失敗時のエラーメッセージ
      }
    };

    return () => {
      document.head.removeChild(script); // クリーンアップ時にスクリプトを削除
    };
  }, []);

  return <div id="map" style={{ height: "100vh", width: "100vw" }} />; // 地図の表示領域を設定
}
