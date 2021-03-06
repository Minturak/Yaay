const initialState = {
  user: undefined,
  groups: undefined,
  categories: undefined,
  group:undefined,
  invitations:undefined,
  event:undefined,
  dispo:undefined,
  eventFrom:undefined,
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
    case "SET_GROUPS":
        nextState={
          ...state,
          groups:action.payload
        }
        return nextState || state
    case "SET_CATEGORIES":
        nextState={
          ...state,
          categories:action.payload
        }
        return nextState || state
    case "SELECT_GROUP":
        nextState={
          ...state,
          group:action.payload
        }
        return nextState || state
    case "SET_INVITATIONS":
        nextState={
          ...state,
          invitations:action.payload
        }
        return nextState || state
    case "SELECT_EVENT":
        nextState={
          ...state,
          event:action.payload
        }
        return nextState || state
    case "SELECT_DISPO":
      nextState={
        ...state,
        dispo:action.payload
      }
      return nextState || state
    case "EVENT_FROM":
      nextState={
        ...state,
        eventFrom:action.payload
      }
      return nextState || state
    default:
      return state
  }
}
export default connectReducer
