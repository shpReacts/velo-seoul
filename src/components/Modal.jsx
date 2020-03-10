import React from "react";
import styled from "styled-components";
import { transparentize } from "polished";

const StyledModal = styled.div`
  position: absolute;
  max-width: 500px;
  bottom: 5px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  padding: 10px;
  z-index: 2;
  border-radius: 10px;
  line-height: 1.5;
  background-color: ${transparentize(0.2, "#2c3e50")};
  color: white;
  font-weight: bold;
  font-size: 1.1rem;

  p {
    margin: 0;
    padding: 0;
  }
`;

const Modal = ({ msg1, msg2 }) => {
  return (
    <StyledModal>
      <p>{msg1}</p>
      <p>{msg2}</p>
    </StyledModal>
  );
};

export default Modal;
