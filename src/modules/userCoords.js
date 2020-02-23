const SET = "userCoords/SET";

export default function userCoordsReducer(state = null, action) {
  switch (action.type) {
    case SET:
      return action.payload;
    default:
      return state;
  }
}

export const createUserCoordsAction = coords => ({
  type: SET,
  payload: coords
});
