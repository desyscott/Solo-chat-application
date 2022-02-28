import React,{useState,useEffect,}  from 'react'
import { StyleSheet,FlatList ,SafeAreaView, View,TouchableWithoutFeedback,Keyboard} from 'react-native'
import Message from "../components/Message/Message"
import MessageInput from "../components/MessageInput/MessageInput"
import { useRoute } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/core';
import {auth,db} from "../Firebase"
import { StatusBar } from 'expo-status-bar';


export default function ChatRoomScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    
    const userID= route.params?.id 
    const user= route.params?.user
    const user1= route.params?.user1 
    const user2= route.params?.user2 
   

    console.log("Displaying the chat room userID:",userID )
    console.log("Displaying the chat room user1:",user1 )
    console.log("Displaying the chat room user2:",user2 )
   
    const[messages,setMessages]=useState([])
      
    
   //////////////////////////////////////Fetching messages from firebase database /////////////////////////////////////////////////
    useEffect(() => { 
      const id=user1 > user2 ? `${user1 + user2}`:`${user2 + user1}`;
      
        const unsubscribe = db.collection("messages")
          .doc(id||userID)
          .collection("chats")
          .orderBy("timeStamp", "desc")
          .onSnapshot((snapshot) =>
            setMessages(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }))
            )
          );
        return unsubscribe;
      }, [route]);
    

    
    
    return (
        <View style={styles.page}>
        <StatusBar style="auto"/>
        <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
        <FlatList
          data={messages}
          renderItem={({ id,item }) => (
            <Message key={id} message={item} id={id} user1={user1} user2={user2}/>
          )}
          showsVerticalScrollIndicator={true}
          inverted
          maxToRenderPerBatch={6}
        />
        </TouchableWithoutFeedback>
   
         <MessageInput  navigation={navigation} user={user} userID={userID} user1={user1} user2={user2} />

        </View>
    )
}


const styles = StyleSheet.create({
    page:{
        backgroundColor: "#fff",
        flex: 1,
    }
})