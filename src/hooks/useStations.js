import { useEffect, useState } from "react";
import axios from "axios";

export default function useStations() {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStations = async (start, end) => {
      setIsLoading(true);

      try {
        const res = await axios.get(
          `http://openapi.seoul.go.kr:8088/${process.env.REACT_APP_SEOUL_BIKE_API_KEY}/json/bikeList/${start}/${end}/`
        );

        if (res.data.rentBikeStatus.RESULT.CODE === "INFO-000") {
          setStations(prevStations => [
            ...prevStations,
            ...res.data.rentBikeStatus.row.map(
              ({
                stationName,
                stationLatitude,
                stationLongitude,
                parkingBikeTotCnt
              }) => ({
                name: stationName,
                coord: {
                  latitude: stationLatitude,
                  longitude: stationLongitude
                },
                bikeCount: parkingBikeTotCnt
              })
            )
          ]);
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStations(1, 1000);
    fetchStations(1001, 2000);
  }, []);

  return [stations, isLoading, error];
}
