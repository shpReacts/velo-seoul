/*global kakao*/

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getDistance } from "geolib";

import marker0 from "../images/map-marker0.png";
import marker13 from "../images/map-marker13.png";
import marker46 from "../images/map-marker46.png";
import marker7 from "../images/map-marker7.png";
import { cleanup } from "@testing-library/react";

const StyledMap = styled.div`
  height: calc(100vh - 60px);
`;

const Map = ({ kakaoCoords, setKakaoCoords, accuracy, setAccuracy }) => {
  const [map, setMap] = useState();
  const [stations, setStations] = useState([]);
  const [centerCoords, setCenterCoords] = useState();
  const [closeStations, setCloseStations] = useState([]);
  const [locationMarker, setLocationMarker] = useState();

  useEffect(() => {
    // load script dynamically
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAPS_API_KEY}&libraries=services&autoload=false`;
    document.head.appendChild(script);

    let newMap;
    let idleHandler;

    script.onload = () => {
      kakao.maps.load(() => {
        const mapContainer = document.getElementById("map");

        newMap = new kakao.maps.Map(mapContainer, {
          center: new kakao.maps.LatLng(37.5669, 126.9787),
          level: 4
        });
        setCenterCoords(newMap.getCenter());

        // put map controls on map
        const mapTypeCtrl = new kakao.maps.MapTypeControl();
        newMap.addControl(mapTypeCtrl, kakao.maps.ControlPosition.TOPRIGHT);

        const zoomCtrl = new kakao.maps.ZoomControl();
        newMap.addControl(zoomCtrl, kakao.maps.ControlPosition.RIGHT);

        idleHandler = () => {
          setCenterCoords(newMap.getCenter());
        };

        kakao.maps.event.addListener(newMap, "idle", idleHandler);

        setMap(newMap);
      });
    };

    // event listener cleanup
    return () => kakao.maps.event.removeListener(newMap, "idle", idleHandler);
  }, []);

  useEffect(() => {
    if (map) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          setKakaoCoords(
            new kakao.maps.LatLng(coords.latitude, coords.longitude)
          );
          setAccuracy(coords.accuracy);
        });
      } else {
        alert(
          "Your browser doesn't support location feature. You can still search your location on the top right corner of the page."
        );
      }
    }
  }, [map]);

  useEffect(() => {
    if (map && kakaoCoords) {
      map.setCenter(kakaoCoords);

      const marker = new kakao.maps.Marker({ position: kakaoCoords });
      setLocationMarker(marker);

      marker.setMap(map);
    }
  }, [kakaoCoords, map]);

  useEffect(() => {
    const fetchStations = async (start, end) => {
      const response = await fetch(
        `http://openapi.seoul.go.kr:8088/${process.env.REACT_APP_SEOUL_BIKE_API_KEY}/json/bikeList/${start}/${end}/`
      );
      const data = await response.json();

      if (data.rentBikeStatus.RESULT.CODE === "INFO-000") {
        setStations(prevStations => [
          ...prevStations,
          ...data.rentBikeStatus.row.map(
            ({
              stationName,
              stationLatitude,
              stationLongitude,
              parkingBikeTotCnt
            }) => ({
              name: stationName,
              coord: { latitude: stationLatitude, longitude: stationLongitude },
              bikeCount: parkingBikeTotCnt
            })
          )
        ]);
      } else {
        alert(
          "현재 서울특별시 공공자전거 실시간 대여정보가 제공되지 않고 있습니다. 나중에 다시 시도해주십시오."
        );
      }
    };

    fetchStations(1, 1000);
    fetchStations(1001, 2000);
  }, []);

  useEffect(() => {
    if (stations && centerCoords) {
      setCloseStations(
        stations.filter(station => {
          const distance = getDistance(
            station.coord,
            { latitude: centerCoords.Ha, longitude: centerCoords.Ga },
            accuracy
          );

          return distance <= 500;
        })
      );
    }
  }, [accuracy, centerCoords, stations]);

  useEffect(() => {
    closeStations.forEach(({ name, bikeCount, coord }) => {
      const imgSize = new kakao.maps.Size(30, 40);
      const imgOption = { offset: new kakao.maps.Point(15, 40) };
      let imgSrc = "";

      if (bikeCount >= 7) {
        imgSrc = marker7;
      } else if (bikeCount >= 4) {
        imgSrc = marker46;
      } else if (bikeCount >= 1) {
        imgSrc = marker13;
      } else {
        imgSrc = marker0;
      }

      const markerImg = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption);

      const markerPos = new kakao.maps.LatLng(coord.latitude, coord.longitude);

      const newMarker = new kakao.maps.Marker({
        position: markerPos,
        clickable: true,
        image: markerImg
      });

      newMarker.setMap(map);

      const clearMarkers = () => {
        newMarker.setMap(null);
      };

      kakao.maps.event.addListener(map, "center_changed", clearMarkers);
    });
  }, [closeStations, map]);

  useEffect(() => {
    if (map) {
      const rad = new kakao.maps.Circle({
        center: map.getCenter(), // 원의 중심좌표 입니다
        radius: 500, // 미터 단위의 원의 반지름입니다
        strokeWeight: 2, // 선의 두께입니다
        strokeColor: "#ff6f6e", // 선의 색깔입니다
        strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: "solid",
        fillColor: "#2c3e50",
        fillOpacity: 0.2
      });

      rad.setMap(map);

      const removeRad = () => {
        rad.setMap(null);
      };

      kakao.maps.event.addListener(map, "center_changed", removeRad);

      return () =>
        kakao.maps.event.removeListener(map, "center_changed", removeRad);
    }
  }, [map, centerCoords]);

  return <StyledMap id="map" />;
};

export default Map;
