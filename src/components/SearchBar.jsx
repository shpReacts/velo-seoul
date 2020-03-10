/*global kakao*/

import React, { useState, useRef } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { lighten } from "polished";
import { useDispatch } from "react-redux";

import { createUserCoordsAction } from "../modules/userCoords";

const StyledSearchForm = styled.form`
  height: 60%;
  display: flex;
  margin-right: 20px;

  input {
    background-color: ${lighten(0.2, "#2c3e50")};
    color: #ecf0f1;
    outline: none;
    padding: 5px;
    border: 3px solid #ff6f6e;
    border-right: none;
    border-radius: 5px 0 0 5px;
  }

  input::placeholder {
    color: white;
    font-size: 14px;
  }

  button {
    width: 50px;
    background: none;
    border: 1px solid #ff6f6e;
    border-radius: 0 5px 5px 0;
    background-color: #ff6f6e;
    color: #fff;
    cursor: pointer;
  }

  @media screen and (max-width: 500px) {
    margin-right: 10px;

    input {
      width: 150px;
    }

    input::placeholder {
      font-size: 11px;
    }

    button {
      width: 40px;
    }
  }
`;

const SearchBar = () => {
  const [addr, setAddr] = useState("");

  const inputRef = useRef();

  const dispatch = useDispatch();

  const handleAddrChange = e => {
    setAddr(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    inputRef.current.blur();
    setTimeout(() => {
      const geocoder = new kakao.maps.services.Geocoder();

      geocoder.addressSearch(addr, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const newUserCoords = new kakao.maps.LatLng(result[0].y, result[0].x);

          dispatch(createUserCoordsAction(newUserCoords));
        } else {
          alert("존재하지 않는 주소 또는 행정구역명입니다. 다시 시도해주세요.");
        }
      });
    }, 100);
  };

  return (
    <StyledSearchForm onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="행정구역명 또는 주소 입력"
        onChange={handleAddrChange}
        value={addr}
        ref={inputRef}
      />
      <button type="submit">
        <FaSearch />
      </button>
    </StyledSearchForm>
  );
};

export default SearchBar;
