import {USER_STATE_CHANGE} from "./usersType"

const initialState ={
    currentUser:null
}

 const UsersReducer=(state=initialState, action)=>{
    switch(action.type){
        case USER_STATE_CHANGE:
        return  {
            ...state,
            currentUser: action.payLoad
            }
        
    }
    return state
}
 
export default  UsersReducer