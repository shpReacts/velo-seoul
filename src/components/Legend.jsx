import React from "react";
import styled from "styled-components";

import marker0 from "../images/map-marker0.png";
import marker13 from "../images/map-marker13.png";
import marker46 from "../images/map-marker46.png";
import marker7 from "../images/map-marker7.png";
import { transparentize } from "polished";

const StyledLegend = styled.div`
  position: absolute;
  top: 65px;
  left: 5px;
  width: 400px;
  height: 50px;
  z-index: 2;
  border-radius: 5px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: ${transparentize(0.2, "#2c3e50")};

  @media screen and (max-width: 500px) {
    flex-direction: column;
    width: 60px;
    height: 250px;
  }
`;

const StyledLegendItem = styled.div`
  height: 80%;
  width: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 10px;

  span {
    color: #fff;
    font-size: 17px;
    display: block;
    margin-bottom: 2px;
  }

  img {
    height: 50%;
  }

  & + & {
    border-left: 1px solid #ecf0f1;
  }

  @media screen and (max-width: 500px) {
    height: 25%;

    img {
      height: 50%;
    }

    span {
      font-size: 12px;
    }

    & + & {
      border-left: none;
      border-top: 1px solid #ecf0f1;
    }
  }
`;

const Legend = () => {
  return (
    <StyledLegend>
      <StyledLegendItem>
        <span>0대</span>
        <img src={marker0} alt="marker 0" />
      </StyledLegendItem>
      <StyledLegendItem>
        <span>1~3대</span>
        <img src={marker13} alt="marker 0" />
      </StyledLegendItem>
      <StyledLegendItem>
        <span>4~6대</span>
        <img src={marker46} alt="marker 0" />
      </StyledLegendItem>
      <StyledLegendItem>
        <span>7대 이상</span>
        <img src={marker7} alt="marker 0" />
      </StyledLegendItem>
    </StyledLegend>
  );
};

export default Legend;
