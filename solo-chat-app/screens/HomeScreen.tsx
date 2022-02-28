import  React,{useState,useEffect} from 'react';
import { StyleSheet ,Image ,Text, View,FlatList ,TextInput, ScrollView} from 'react-native';
import { FontAwesome,Feather,Ionicons} from '@expo/vector-icons';
import {auth,db} from "../Firebase"
import HomeChatRoom from "../components/HomeChatRoom/HomeChat"
import { StatusBar } from 'expo-status-bar';
import {connect} from "react-redux";
import moment from "moment";



 function TabOneScreen({currentUser}) {
  const [users,setUsers]=useState([])
  const [chats,setChats]=useState([])
  
  /////////////////////////////////////////////////////////////////Querying all users from firebase////////////////////////////////////////////////////
  const user1=auth.currentUser.uid
  useEffect(()=>{
    const colRef= db.collection("users")
    const q =colRef.where("userId", "not-in", [user1])
    
    const unsub=q.onSnapshot((querySnapshot)=>{
      let users = []
      querySnapshot.docs.forEach((doc) => {
           users.push(doc.data())
                
             });
           setUsers(users)
    })
    
    return unsub
  
   },[])
   console.log(users)
   
   
  
  /////////////////////////////////////////fetching addedChat from firebase/////////////////////////////////////////////////////////////////
  useEffect(()=>{
    const unsubscribe=db.collection("messages")
    .orderBy("chatName")
    .onSnapshot(snapshot=>(
      setChats(snapshot.docs.map((doc)=>({
        userID:doc.id,
        data:doc.data()
      })))
    ))
    return unsubscribe;
  },[])
  
  
  
 //////////////////////////////////////////////////Searching Users///////////////////////////////////////////////////////////////////////////////
  const SearchUser=(search)=>{
  db.collection('users')
  .where("name", ">=", search)
  .get()
  .then((snapshot)=>{
    let users = snapshot.docs.map(doc=>{
      const data=doc.data();
      const id=doc.id;
      return {id,...data}
    })
    setUsers(users)  
  })

  }
  
    //////////////////////////////////////////////////////////////Updating the users last seen//////////////////////////////////////////////////
  const updateLastOnline = () => {
    if (!currentUser) {
      return;
    }
    db.collection("users").doc(auth.currentUser.uid).update({
      lastOnlineAt: moment().format(),
    });
  };

  useEffect(() => {
    const unsubscribe = updateLastOnline();
    return unsubscribe;
  }, [currentUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateLastOnline();
    }, 30 * 1000);
    return () => clearInterval(interval);
  }, [currentUser]);


 
 
  return (
    <View style={styles.pages}>
    <ScrollView style={{height:"100%"}}>
    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
    <View style={styles.searchInputContainer}>
      <Ionicons name="md-search-sharp" size={20} color="#999999" style={{marginRight:5}}/>
      <TextInput placeholder="Search" placeholderTextColor={"#999999"} 
      onChangeText={(search)=>SearchUser(search)}
      style={styles.searchInput}/>
      </View>
      </View>
    <StatusBar style="auto"/>
    {users.map(user=>
       <HomeChatRoom key={user.userId}   user={user} user1={user1} user2={user.userId}/>  )}
    
    {chats.map(({userID,data:{chatName}})=>(
      <HomeChatRoom key={userID} userID={userID} chatName={chatName} user1={user1}/>
    ))}

  
    </ScrollView>
    </View>
    
  );
}
const mapStateToProps=(state)=>{
  return{
    currentUser:state.usersState.currentUser
  }
}
export default connect(mapStateToProps,null)(TabOneScreen)




const styles= StyleSheet.create({
  pages:{
    backgroundColor:"#fff",
    flex:1,
  },
  searchInputContainer:{
      alignItems: "center",
       flexDirection:"row",
       backgroundColor:"#ececec",
       width:"90%",
       height:40,
       borderRadius:10,
       padding:5,
       marginLeft:10,
      marginTop:5,
    },
    searchInput: {
      width:"100%",
      height:"100%",
      fontSize:16,
    },

})

