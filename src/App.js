import React, { useState } from "react";
import Navigation from "./components/Navigation";
import Map from "./components/Map";

function App() {
  const [kakaoCoords, setKakaoCoords] = useState(null);

  return (
    <>
      <Navigation setKakaoCoords={setKakaoCoords} />
      <Map kakaoCoords={kakaoCoords} setKakaoCoords={setKakaoCoords} />
    </>
  );
}

export default App;
