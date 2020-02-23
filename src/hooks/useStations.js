import { useEffect, useState } from "react";
import axios from "axios";

export default function useStations() {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStations = async part => {
      setIsLoading(true);

      try {
        const res = await axios.get(
          `https://us-central1-veloseoul-604e9.cloudfunctions.net/widgets/${part}`
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

    fetchStations("first");
    fetchStations("second");
  }, []);

  return [stations, isLoading, error];
}
