export function connectUser(user) {
    return {
        type:"USER_CONNECT",
        payload:user
    }
}
