import React,{ useState,useEffect} from "react";
import { useNavigation } from "@react-navigation/core";
import { StyleSheet, Image, Text, View, Pressable, TouchableOpacity} from "react-native";
import {auth,db} from "../../Firebase"
import {styles} from "./style"
import moment from "moment";
import { Ionicons,MaterialCommunityIcons,Feather} from '@expo/vector-icons';

const HomeChat = ({user,chatName,userID,user1,user2}) => {
         const[lastMessage,setLastMessage]= useState([])
            const navigation =useNavigation()

///////////////////////////////////////////////fetching last message onSnapshot collection///////////////////////////////////////////////////
  useEffect(() => {
const id=user1 > user2 ? `${user1 + user2}`:`${user2 + user1}`;
    const unsubscribe=db.collection("lastMessages")
    .doc(id||userID)
    .onSnapshot((doc)=>{
        setLastMessage(
          doc.data()
        )   
    })
    return unsubscribe
  },[])
   const time=lastMessage?.timeStamp?.toDate()
   .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
   

///////////////////////////////////////////updating the unread property/////////////////////////////////////////////////////////////////
const selectUser=async(user)=>{
  const id=user1 > user2 ? `${user1 + user2}`:`${user2 + user1}`;
  const docSnap=await db.collection("lastMessages").doc(id).get()
  if(docSnap.data()?.From!==user1)
  await db.collection("lastMessages").doc(id).update({
     unread: false,
    })
}
console.log(user)

/////////////////////////////////////////////////////////////fetching and updating last online  status//////////////////////////////////////
const [lastOnlineAt, setLastOnlineAt] = useState(null);
const updateOnlineStatus = () =>
  db
    .collection("users")
    .doc(user2)
    .onSnapshot((doc) => {
      const diffLastOnline = moment().diff(moment(doc?.data()?.lastOnlineAt));
      if (diffLastOnline && diffLastOnline < 1 * 60 * 1000) {
        setLastOnlineAt("online");
      } else {
        setLastOnlineAt(
          `last seen ${moment(doc?.data()?.lastOnlineAt).fromNow()}`
        );
      }
    });

useEffect(() => {
  const unsubscribe = updateOnlineStatus();
  return unsubscribe;
}, [lastOnlineAt]);

useEffect(() => {
  const interval = setInterval(() => {
    updateOnlineStatus();
  }, 40 * 1000);
  return () => clearInterval(interval);
}, [lastOnlineAt]);

  
  return (
    <Pressable  style={styles.container}  
    onPress={()=>navigation.navigate("ChatRoom",{id :userID,lastOnlineAt:lastOnlineAt,chatName:chatName,slectectUser:selectUser(user),user:user,user1,user2})}>
     
      <Image
        source={{
          uri: user?.photoURL|| auth.currentUser.photoURL,
        }}
        style={styles.img}
      />
      {/* {lastMessage?.length && */}
      <View style={styles.notifyBagde}>
        <Text style={{fontSize: 15, color: "#fff",textAlign: "center" }}>
          {lastMessage?.From !==user1 && lastMessage?.unread  &&(<Text>unread</Text>)}
        </Text>
      </View>

      <View style={styles.textSection}>
        <View style={styles.UserInfoSection}>
          <Text style={styles.name}>{user?.displayName}{chatName}</Text>
          {lastMessage?.From !==user1 && lastMessage?.unread ? (<Text style={styles.text2}>{time}</Text>):(
        (<Text style={styles.text}>{time}</Text>)
      )}
       
        </View>
        <View style={{ flexDirection: "row",alignItems: "center"}}>      
  {lastMessage?.imageContent  &&      
   <View style={{
   paddingBottom: 10,
   marginRight: 5}}>
   <Ionicons name="ios-camera-outline" size={21} color="grey" />
   </View>
}
{lastMessage?.content &&
        <Text numberOfLines={1} style={styles.messages}>
  {lastMessage?.content}
        </Text>
        }
   </View>
 
      </View>
    </Pressable>
 
    
  );
};
  


export default HomeChat;
