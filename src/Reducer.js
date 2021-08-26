export const initialState = {
  user: null,
  userName: null,
  userEmail: null,
  uid: null,
  photoURL: null,
  test: 0,
};

export const actionTypes = {
  SET_USER: "SET_USER",
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
        userName: action.userName,
        userEmail: action.userEmail,
        uid: action.uid,
        photoURL: action.photoURL,
        test: action.test,
      };
    default:
      return state;
  }
};

export default reducer;
