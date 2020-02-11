import React from "react";
import styled from "styled-components";
import logo from "../images/logo.png";

const Nav = styled.nav`
  height: 60px;
  background-color: #2c3e50;
  color: #fff;
  display: flex;
  align-items: center;

  .logo {
    margin-left: 20px;
    height: 70%;
  }
`;

const Navigation = () => {
  return (
    <Nav>
      <img className="logo" src={logo} alt="logo of veloseoul" />
    </Nav>
  );
};

export default Navigation;
