import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import markerX from "../images/map-marker-oos.png";
import marker0 from "../images/map-marker0.png";
import marker13 from "../images/map-marker13.png";
import marker46 from "../images/map-marker46.png";
import marker7 from "../images/map-marker7.png";

const MapContainer = styled.div`
  height: 100%;
`;

const Map = () => {
  const mapContainer = useRef();
  const [map, setMap] = useState();
  const [stations, setStations] = useState([]);
  const [bounds, setBounds] = useState({});

  useEffect(() => {
    const newMap = new window.kakao.maps.Map(mapContainer.current, {
      center: new window.kakao.maps.LatLng(37.5669, 126.9787),
      level: 4
    });

    const mapTypeCtrl = new window.kakao.maps.MapTypeControl();
    const zoomCtrl = new window.kakao.maps.ZoomControl();

    newMap.addControl(mapTypeCtrl, window.kakao.maps.ControlPosition.TOPRIGHT);
    newMap.addControl(zoomCtrl, window.kakao.maps.ControlPosition.RIGHT);

    window.kakao.maps.event.addListener(newMap, "bounds_changed", () => {
      const boundary = newMap.getBounds();
      const sw = boundary.getSouthWest();
      const ne = boundary.getNorthEast();

      setBounds({ sw, ne });
    });

    setMap(newMap);
  }, [mapContainer]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const userLocation = new window.kakao.maps.LatLng(
          coords.latitude,
          coords.longitude
        );

        if (map) {
          map.setCenter(userLocation);
        }
      });
    } else {
      alert(
        "Your browser doesn't support location feature. You can still search your location on the top right corner of the page."
      );
    }
  }, [map]);

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
              coord: { lat: stationLatitude, lng: stationLongitude },
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
    if (stations) {
      stations.forEach(({ bikeCount, coord }) => {
        const imgSize = new window.kakao.maps.Size(30, 40);
        const imgOption = { offset: new window.kakao.maps.Point(15, 40) };
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

        const markerImg = new window.kakao.maps.MarkerImage(
          imgSrc,
          imgSize,
          imgOption
        );
        const markerPos = new window.kakao.maps.LatLng(coord.lat, coord.lng);

        new window.kakao.maps.Marker({
          position: markerPos,
          clickable: true,
          image: markerImg
        }).setMap(map);
      });
    }
  }, [stations, map]);

  return <MapContainer id="map" ref={mapContainer} />;
};

export default Map;
