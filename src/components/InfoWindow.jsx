import React from "react";
import styled from "styled-components";
import { transparentize } from "polished";

const StyledInfoWindow = styled.div`
  height: 100px;
  width: 200px;
  border-radius: 10px;
  background-color: ${transparentize(0.2, "#2c3e50")};
  display: none;
`;

const InfoWindow = ({ name, bikeCount }) => {
  return (
    <StyledInfoWindow>
      <span>{name}</span>
      <span>{bikeCount}</span>
    </StyledInfoWindow>
  );
};

export default InfoWindow;
