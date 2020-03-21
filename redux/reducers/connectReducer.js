const initialState = {
  user: undefined
}

const connectReducer = (state = initialState, action)=>{
  let nextState
  
  switch (action.type) {
    case "USER_CONNECT":
        nextState = {
          ...state,
          user: action.payload
        }
        return nextState || state
    default:
      return state
  }
}
export default connectReducer
