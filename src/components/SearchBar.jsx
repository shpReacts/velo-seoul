import React, { useState } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { lighten } from "polished";

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

    button {
      width: 40px;
    }
  }
`;

const SearchBar = ({ setKakaoCoords }) => {
  const [addr, setAddr] = useState("");

  const handleAddrChange = e => {
    setAddr(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(addr, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setKakaoCoords(new window.kakao.maps.LatLng(result[0].y, result[0].x));
      } else {
        setKakaoCoords(null);
        console.log("주소를 찾을 수 없습니다.");
      }
    });
  };

  return (
    <StyledSearchForm onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="주소 검색"
        onChange={handleAddrChange}
        value={addr}
      />
      <button type="submit">
        <FaSearch />
      </button>
    </StyledSearchForm>
  );
};

export default SearchBar;