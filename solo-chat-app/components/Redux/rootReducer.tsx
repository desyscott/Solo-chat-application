import UsersReducer from "./Reducers/UserReducer/usersReducer"

import {combineReducers} from "redux"

const rootReducer= combineReducers({
    usersState:UsersReducer
})
export default rootReducer