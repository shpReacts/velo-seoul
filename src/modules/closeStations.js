import { getDistance } from "geolib";

const UPDATE = "closeStations/UPDATE";

export default function setStations(state = [], action) {
  switch (action.type) {
    case UPDATE:
      const { stations, centerCoords } = action.payload;

      return stations.filter(station => {
        const distance = getDistance(
          station.coord,
          { latitude: centerCoords.Ha, longitude: centerCoords.Ga },
          1
        );

        return distance <= 500;
      });
    default:
      return state;
  }
}

export const createCloseStationsAction = (stations, centerCoords) => ({
  type: UPDATE,
  payload: {
    stations,
    centerCoords
  }
});
