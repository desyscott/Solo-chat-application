import {LAST_MESSAGE_STATE_CHANGE} from "./lastMessagesType"
import {auth,db} from "../../../../Firebase"

const fetchLastMessagesAction=(lastMessages)=>{
    return{
        type:LAST_MESSAGE_STATE_CHANGE,
        payLoad:lastMessages
    }
}



export const fetchLastMessages=()=>{
    return (dispatch)=>{
        db.collection("lastMessages")
       
        .onSnapshot((snapshot)=>{
           
            const lastMessages=snapshot.data();
            dispatch(fetchLastMessagesAction(lastMessages))
          
        })
    }
}