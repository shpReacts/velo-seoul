/*global kakao*/

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { createCloseStationsAction } from "../modules/closeStations";
import { createUserCoordsAction } from "../modules/userCoords";

import useStations from "../hooks/useStations";

import marker0 from "../images/map-marker0.png";
import marker13 from "../images/map-marker13.png";
import marker46 from "../images/map-marker46.png";
import marker7 from "../images/map-marker7.png";
import Modal from "./Modal";

const StyledMap = styled.div`
  height: calc(100vh - 60px);
`;

const Map = () => {
  const [map, setMap] = useState();
  const [stations, isLoading, error] = useStations();

  const dispatch = useDispatch();
  const closeStations = useSelector(store => store.closeStations);
  const userCoords = useSelector(store => store.userCoords);

  // kakao maps scirpt를 동적으로 로드
  useEffect(() => {
    // load script dynamically
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAPS_API_KEY}&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        const mapContainer = document.getElementById("map");

        const newMap = new kakao.maps.Map(mapContainer, {
          center: new kakao.maps.LatLng(37.5669, 126.9787),
          level: 5
        });
        // put map controls on map
        const mapTypeCtrl = new kakao.maps.MapTypeControl();
        newMap.addControl(mapTypeCtrl, kakao.maps.ControlPosition.TOPRIGHT);

        const zoomCtrl = new kakao.maps.ZoomControl();
        newMap.addControl(zoomCtrl, kakao.maps.ControlPosition.RIGHT);

        setMap(newMap);
        dispatch(createUserCoordsAction(newMap.getCenter()));
      });
    };
  }, [dispatch]);

  useEffect(() => {
    if (map) {
      const movementHandler = () => {
        dispatch(createUserCoordsAction(map.getCenter()));
      };

      kakao.maps.event.addListener(map, "idle", movementHandler);

      return () =>
        kakao.maps.event.removeListener(map, "idle", movementHandler);
    }
  }, [map, dispatch]);

  // 사용자의 현재 위치 조회
  useEffect(() => {
    if (map) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          const newUserCoords = new kakao.maps.LatLng(
            coords.latitude,
            coords.longitude
          );

          dispatch(createUserCoordsAction(newUserCoords));
        });
      } else {
        alert(
          "이 브라우저에서는 위치 기능을 사용할 수 없습니다. 우측 상단의 검색 기능을 이용하시거나 다른 브라우저로 다시 접속해주세요."
        );
      }
    }
  }, [dispatch, map]);

  // userCoords에 marker와 500미터 반경 렌더
  useEffect(() => {
    if (map && userCoords) {
      map.setCenter(userCoords);
      const marker = new kakao.maps.Marker({ position: userCoords });

      const rad = new kakao.maps.Circle({
        center: userCoords,
        radius: 500,
        strokeWeight: 2,
        strokeColor: "#ff6f6e",
        strokeOpacity: 1,
        strokeStyle: "solid",
        fillColor: "#2c3e50",
        fillOpacity: 0.2
      });

      rad.setMap(map);
      marker.setMap(map);

      return () => {
        rad.setMap(null);
        marker.setMap(null);
      };
    }
  }, [userCoords, map]);

  // 지도 중심에서 500m 반경 이내의 스테이션을 closeStations 상태 배열에 넣음
  useEffect(() => {
    if (map && userCoords) {
      dispatch(createCloseStationsAction(stations, userCoords));
    }
  }, [userCoords, dispatch, stations, map]);

  // closeStations에 대한 marker를 지도에 렌더
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

  return (
    <>
      {isLoading && (
        <Modal
          msg1="서울시 공공자전거 실시간 정보를 불러오고 있습니다."
          center
        />
      )}
      {error && (
        <Modal msg1="서울시 공공자전거 API가 서비스되지 않고 있습니다. 잠시 후에 다시 시도해주세요." />
      )}
      <StyledMap id="map" />
      {!error && !isLoading && closeStations.length === 0 && (
        <Modal
          msg1="반경 500m 이내에 따릉이 스테이션이 없습니다."
          msg2=" 다른 위치로 움직이거나 우측 상단 검색창을 이용해보세요."
        />
      )}
    </>
  );
};

export default Map;
