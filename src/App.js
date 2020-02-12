import React, { useState } from "react";
import Navigation from "./components/Navigation";
import Map from "./components/Map";
import Legend from "./components/Legend";

function App() {
  const [kakaoCoords, setKakaoCoords] = useState(null);

  return (
    <>
      <Navigation setKakaoCoords={setKakaoCoords} />
      <Legend />
      <Map kakaoCoords={kakaoCoords} setKakaoCoords={setKakaoCoords} />
    </>
  );
}

export default App;
