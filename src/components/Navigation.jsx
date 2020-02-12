import React from "react";
import styled from "styled-components";

import SearchBar from "./SearchBar";
import logo from "../images/logo.png";

const Nav = styled.nav`
  height: 60px;
  background-color: #2c3e50;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .logo {
    margin-left: 20px;
    height: 70%;

    @media screen and (max-width: 500px) {
      margin-left: 10px;
      height: 50%;
    }
  }
`;

const Navigation = ({ setKakaoCoords }) => {
  return (
    <Nav>
      <img className="logo" src={logo} alt="veloseoul" />
      <SearchBar setKakaoCoords={setKakaoCoords} />
    </Nav>
  );
};

export default Navigation;
