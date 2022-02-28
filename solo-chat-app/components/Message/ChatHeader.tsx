import React from 'react'
import { View, Text,Pressable,useWindowDimensions,StyleSheet,Image} from 'react-native'
import {Ionicons,} from '@expo/vector-icons';
import {auth} from "../../Firebase"
import { StatusBar } from 'expo-status-bar';



export const ChatHeader = ({user, chatName,lastOnlineAt}) => {
  const {width} = useWindowDimensions()

    return (
      <View
        style={{flexDirection:"row",
        justifyContent: "space-between",
        alignItems: "center",
        width:width-100,
        }}
      >
      <StatusBar style="light"/>
      <Pressable style={styles.userProfile}>
      <Image source={{uri:user?.photoURL ||auth.currentUser.photoURL}}
        style={{ width: 40, height: 40, borderRadius: 50 }}
      />
       <View style={styles.userName}>
        <Text style={{fontWeight:"bold",fontSize:17,color:"#fff"}}>{user?.displayName}{chatName}</Text>
        <Text style={{color:"#fff"}}>{lastOnlineAt}</Text>
        </View>
       
        </Pressable>
        
       
        
       <View style={styles.headerIcons}>
        <Pressable style={{marginRight:15}}>
        <Ionicons name="ios-videocam" size={25} color="#fff" />
        </Pressable>
        
        <Pressable  >
        <Ionicons name="call" size={25} color="#fff" />
        </Pressable>
        </View>
        
      </View>
 
    );
  };


const styles= StyleSheet.create({
  userProfile:{
    flexDirection:"row",
    justifyContent: "space-between",
  },
  userName:{
    marginLeft:10,

  },
  headerIcons:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft:60,
  }
  
})