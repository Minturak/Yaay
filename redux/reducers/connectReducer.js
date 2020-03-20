const initialState = {user: undefined}

const connectReducer = (state = initialState, action)=>{
  switch (action.type) {
    case "USER_CONNECT":
        return {...state, user: action.payload.user}
      break;
    default:
      return state
  }
}
export default connectReducer
