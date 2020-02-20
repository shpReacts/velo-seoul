import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { renderToString } from "react-dom/server";
import { getDistance } from "geolib";

import marker0 from "../images/map-marker0.png";
import marker13 from "../images/map-marker13.png";
import marker46 from "../images/map-marker46.png";
import marker7 from "../images/map-marker7.png";
import InfoWindow from "./InfoWindow";

const StyledMap = styled.div`
  height: calc(100vh - 60px);
`;

const { kakao } = window;

const Map = ({ kakaoCoords, setKakaoCoords, accuracy, setAccuracy }) => {
  const mapContainer = useRef();
  const [map, setMap] = useState();
  const [stations, setStations] = useState([]);
  const [centerCoords, setCenterCoords] = useState();
  const [closeStations, setCloseStations] = useState([]);
  const [markers, setMarkers] = useState([]);

  console.log(kakao);

  useEffect(() => {
    const newMap = new kakao.maps.Map(document.getElementById("map"), {
      center: new kakao.maps.LatLng(37.5669, 126.9787),
      level: 2
    });

    const mapTypeCtrl = new kakao.maps.MapTypeControl();
    const zoomCtrl = new kakao.maps.ZoomControl();

    newMap.addControl(mapTypeCtrl, window.kakao.maps.ControlPosition.TOPRIGHT);
    newMap.addControl(zoomCtrl, window.kakao.maps.ControlPosition.RIGHT);

    const idleHandler = () => {
      setCenterCoords(newMap.getCenter());
    };

    kakao.maps.event.addListener(newMap, "idle", idleHandler);

    setMap(newMap);

    return () => {
      kakao.maps.event.removeListener(newMap, "idle", idleHandler);
    };
  }, [setKakaoCoords]);

  useEffect(() => {
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
  }, [setKakaoCoords, setAccuracy]);

  useEffect(() => {
    if (map && kakaoCoords) {
      map.setCenter(kakaoCoords);

      const marker = new kakao.maps.Marker({ position: kakaoCoords });
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
  }, [accuracy, centerCoords]);

  useEffect(() => {
    let newMarker;
    let handleClick;

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

      newMarker = new kakao.maps.Marker({
        position: markerPos,
        clickable: true,
        image: markerImg
      });

      newMarker.setMap(map);

      setMarkers(prevMarkers => [...prevMarkers, newMarker]);

      const overlay = new kakao.maps.CustomOverlay({
        content: renderToString(<InfoWindow />),
        map: map,
        position: newMarker.getPosition()
      });

      handleClick = () => {
        overlay.setMap(map);
      };

      kakao.maps.event.addListener(newMarker, "click", handleClick);
    });

    return () =>
      kakao.maps.event.removeListener(newMarker, "click", handleClick);
  }, [closeStations, map]);

  return <StyledMap id="map" ref={mapContainer} />;
};

export default Map;
