import {USER_STATE_CHANGE} from "./usersType"
import {auth,db} from "../../../../Firebase"



const fetchUsersAction=(userInfo)=>{
    return{
        type:USER_STATE_CHANGE,
        payLoad:userInfo,
    }
}

export function fetchUser() {
    return (dispatch) => {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            const userInfo=snapshot.data()
            dispatch(fetchUsersAction(userInfo))
          } else {
            console.log("does not exist");
          }
        });
    };
  }
    