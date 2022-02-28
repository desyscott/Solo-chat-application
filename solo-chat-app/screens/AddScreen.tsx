import React, { useState,useEffect } from 'react'
import { View, Text,StyleSheet,TextInput,FlatList, ScrollView,Image,Pressable} from 'react-native'
import { Input,Button} from 'react-native-elements'
import { AntDesign,FontAwesome} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core'

import {auth,db} from "../Firebase"
import {styles} from "../components/HomeChatRoom/style"


const AddScreen = () => {
    const [input,setInput]=useState("")
    const [users,setUsers]=useState([])
    
    const navigation = useNavigation()
    
    //////////////////////////////////////////////////////////////////////Querying all users from firebase//////////////////////////////////////////////////////////
    const user1=auth.currentUser.displayName
    useEffect(()=>{
     db.collection("users")
     .where("name","not-in",[user1])  
     .orderBy("name") 
     .get()
     .then((querySnapshot)=>{
        let users = []
        querySnapshot.forEach((doc) => {
          users.push(doc.data())
            
        });
        setUsers(users)
     
     }).catch((error) => {
         console.error(error.message)
     })
    },[])
    
    
    //////////////////////////////////////////////////////////////Adding new chats////////////////////////////////////////////////////////////////////
    const createChat = async() =>{
          await db.collection("messages").add({
              chatName:input
          }).then(()=>{
              navigation.goBack()
              console.log("submitted")
             
          }).catch((error)=>{
            alert(error.message)
          })
         
    }
    
    
     //////////////////////////////////////////////////////////Searching Users///////////////////////////////////////////////////////////////////////////////
    const SearchUsers=(search)=>{
        db.collection('users')
        .where("name",">=",search)
        .get()
        .then((snapshot)=>{
            let users=snapshot.docs.map((doc)=>{
              const data =  doc.data();
              const id=  doc.id;
              return {id,...data}
            })
         setUsers(users)
        })
    }
    
    return (
        <View style={stylesContainer.container}>
           <Input placeholder="search" onChangeText={(search)=>SearchUsers(search)}
        leftIcon={<FontAwesome name="search" size={24} color="black" />}
           />
            <Input placeholder="new group" value={input}
            
             onChangeText={(text)=>setInput(text)}
             onSubmitEditing={createChat}
            leftIcon={<AntDesign name="wechat" size={24} color="black" />}
             />
            <Button title="Add chat" disabled={!input}  onPress={createChat}/>
           <FlatList 
           data={users} 
           keyExtractor={item=>item.userId}
           renderItem={({item})=>(
            <Pressable  style={styles.container}  
            onPress={()=>navigation.navigate("ChatRoom",{user:item,user1:user1,user2:item.userId})}>
             
              <Image
                source={{
                  uri: item?.photoURL || auth.currentUser.photoURL,
                }}
                style={styles.img}
              />
             
        
              <View style={styles.textSection}>
                <View style={styles.UserInfoSection}>
                  <Text style={styles.name}>{item?.name}</Text>
                 
                </View>
               <Text>{item?.about}</Text>
              </View>
            </Pressable>
         
            
          )}/>
          
        </View>
    )
}

export default AddScreen

const stylesContainer = StyleSheet.create({
    container:{
        padding:10,
        backgroundColor: "#fff",
        height:"100%"
    }
})
