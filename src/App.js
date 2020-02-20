import React, { useState } from "react";
import Navigation from "./components/Navigation";
import Map from "./components/Map";
import Legend from "./components/Legend";

function App() {
  const [kakaoCoords, setKakaoCoords] = useState(null);
  const [accuracy, setAccuracy] = useState(1);

  return (
    <>
      <Navigation setKakaoCoords={setKakaoCoords} setAccuracy={setAccuracy} />
      <Legend />
      <Map
        kakaoCoords={kakaoCoords}
        setKakaoCoords={setKakaoCoords}
        accuracy={accuracy}
        setAccuracy={setAccuracy}
      />
    </>
  );
}

export default App;
