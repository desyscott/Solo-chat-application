import React,{useState,useEffect}from 'react'
import { View, Text,StyleSheet,Image,Pressable,  TouchableOpacity } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons,Ionicons,Feather,Fontisto } from '@expo/vector-icons';
import {connect} from "react-redux"
import { signOut } from '@firebase/auth';
import { db,auth} from "../Firebase";
import { updateDoc,doc } from '@firebase/firestore';
import {fetchUser} from "../components/Redux/index"



const Settings = ({currentUser,fetchUser}) => {
    const navigation = useNavigation()
   
    
    useEffect(() => {
      fetchUser()
    },[])
    
    
    
    const logOut =async()=>{
      try{
        await auth.signOut(); 
        // await db.collection("users").doc(auth.currentUser.uid).update({ 
        //                                   isOnline:false
        //                                                                })
      
      console.log("SignOut successful");
      }catch(error){
        console.warn(error.message)
      }
        }
    
    
    
    if(currentUser===undefined){
      return<View></View>
    }
    
    
    return (
        <View style={styles.container}>
         <Pressable style={styles.profileSec}  onPress={()=>navigation.navigate("Edit Profile")}>
        <View style={styles.avatarImg}>
        <Image source={{uri:currentUser && currentUser.photoURL || "https://www.sandcanyoncc.com/wp-content/uploads/elementor/thumbs/no-profile-picture-icon-15-omqilctwnnaw5c9dnu5i4bvw9ui5vymmtjrwsaz3q0.png"}} 
         style={{ width: 70, height: 70, borderRadius: 50 }}/>
        </View>
        <View style={{justifyContent: 'space-between',flexDirection: 'row', flex:0.9,}}>
        <Text style={{color:"#000",fontWeight:"bold", fontSize:18}}>{currentUser && currentUser.name}</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" /> 
        </View>
        </Pressable>
        
      <View style={styles.accSettings}>
      <TouchableOpacity style={{flexDirection:"row" ,justifyContent:"space-between", }}>
      <View style={{flexDirection:"row" }}>
      <Ionicons name="ios-person-circle-outline" size={24} color="black" />
      <Text  style={{marginLeft:20 ,fontSize:15,fontWeight:"bold"}}>Account</Text>
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={24} color="#8E959B" /> 
      </TouchableOpacity>
      <View style={styles.horiLine}/>
     <TouchableOpacity style={{flexDirection:"row",justifyContent:"space-between"}}>
     <View style={{flexDirection:"row"}}>
      <Feather name="link" size={24} color="black" />
     <Text  style={{marginLeft:20 ,fontSize:15,fontWeight:"bold"}}>Link Devices</Text>
     </View>
     <MaterialIcons name="keyboard-arrow-right" size={24} color="#8E959B" /> 
     </TouchableOpacity>
       </View>
       
      <Pressable style={styles.accDetails}>
      <TouchableOpacity style={styles.appearance}>
      <View style={{flexDirection:"row"}}>
      <MaterialIcons name="brightness-5" size={24} color="black" />
      <Text  style={{fontSize:15,fontWeight:"bold" , marginLeft:20}}>Appearance</Text>
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={24} color="#8E959B" /> 
      </TouchableOpacity >
      <View style={styles.horiLine}/>
      <TouchableOpacity style={styles.chat}>
      <View style={{flexDirection:"row"}}>
      <Ionicons name="chatbubble-outline" size={24} color="black" />
      <Text  style={{fontSize:15,fontWeight:"bold" , marginLeft:20}}>Chats</Text>
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={24} color="#8E959B" /> 
      </TouchableOpacity>
      <View style={styles.horiLine}/>
     <TouchableOpacity style={styles.notify}>
     <View style={{flexDirection:"row"}}>
     <Ionicons name="ios-notifications-outline" size={24} color="black" />
     <Text  style={{fontSize:15,fontWeight:"bold" , marginLeft:20}}>Notifications</Text>
     </View>
     <MaterialIcons name="keyboard-arrow-right" size={24} color="#8E959B" /> 
     </TouchableOpacity>
     <View style={styles.horiLine}/>
      <TouchableOpacity style={styles.privacy}>
      <View style={{flexDirection:"row"}}>
      <MaterialIcons name="privacy-tip" size={24} color="black" />
      <Text  style={{fontSize:15,fontWeight:"bold" , marginLeft:20}}>Privacy</Text>
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={24} color="#8E959B" /> 
      </TouchableOpacity>
      <View style={styles.horiLine}/>
       <TouchableOpacity style={styles.dataUsage}>
       <View style={{flexDirection:"row"}}>
       <MaterialIcons name="data-usage" size={24} color="black" />
       <Text  style={{fontSize:15,fontWeight:"bold" , marginLeft:20}}>Data Usage</Text>
       </View>
       <MaterialIcons name="keyboard-arrow-right" size={24} color="#8E959B" /> 
       </TouchableOpacity>
      </Pressable>
      
        <TouchableOpacity style={styles.helpSec} activeOpacity={.8}>
        <View style={{flexDirection:"row"}}>
        <Ionicons name="ios-help-circle-outline" size={28} color="black" />
        <Text style={{fontSize:15,fontWeight:"bold",marginLeft:20}}>Help</Text>
        </View>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#8E959B" /> 
        </TouchableOpacity>
     
    
       <TouchableOpacity style={styles.emailSec} activeOpacity={.8}>
       <Fontisto name="email" size={24} color="black" />
       <Text style={{fontSize:15,fontWeight:"bold" , marginLeft:10}}>Invite Your Friends</Text>
       </TouchableOpacity>
    
      <Pressable onPress={logOut} style={styles.logOut}>
      <MaterialIcons name="logout" size={24} color="black" />
        <Text style={{fontSize:15,fontWeight:"bold", marginLeft:10}}>Logout</Text>
      </Pressable>
        </View>
       
    )
}
const mapStateToProps=(state)=>{
  return{
    currentUser:state.usersState.currentUser
  }
}
const mapDispatchToProps=(dispatch)=>{
  return{
    fetchUser:()=>dispatch(fetchUser()) 
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Settings)


const styles = StyleSheet.create({
    container:{
        backgroundColor: "#ececec",
        flex:1,
        alignItems: "center"
    
    },
    profileSec:{
        height:80,
        width:"90%",
        backgroundColor: "#fff",
        borderRadius:10,
        marginHorizontal:10,
        padding:10,
        margin:10,
        flexDirection:"row",
        alignItems: "center",
    },
    avatarImg:{
        borderRadius:50, 
          width: 70,
         height: 70,
         backgroundColor: "#8E959B",
         margin:10,
       justifyContent: "center",
         alignItems: "center",
         
     
    },logOut:{
      marginHorizontal:5,
      backgroundColor: "#fff",
      marginTop:10,
      margin:10,
      padding: 10,
      height:50,
      width:"90%",
      borderRadius:10, 
      flexDirection:"row",
      alignItems: "center",
      justifyContent: "flex-start",
      
    },
    accSettings:{
      marginHorizontal:5,
      backgroundColor: "#fff",
      marginTop:10,
      margin:10,
      height:80,
      width:"90%",
      borderRadius:10,
      padding:10, 
    },
    
    accDetails:{
      marginHorizontal:5,
      backgroundColor: "#fff",
      marginTop:10,
      margin:10,
      padding:15, 
      height:200,
      width:"90%",
      borderRadius:10, 
    }
    ,helpSec:{
      marginHorizontal:5,
      backgroundColor: "#fff",
      marginTop:10,
      margin:10,
      padding: 10,
      height:50,
      width:"90%",
      borderRadius:10, 
      flexDirection:"row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    emailSec:{
      marginHorizontal:5,
      backgroundColor: "#fff",
      marginTop:10,
      margin:10,
      padding: 10,
      height:50,
      width:"90%",
      borderRadius:10, 
      flexDirection:"row",
      justifyContent: "flex-start",
      alignItems: "center"
    },
    horiLine:{
      width:"90%",
      height:1,
      backgroundColor: "#8E959B",
      marginHorizontal:42,
      margin:5,
   
    },appearance:{
      flexDirection:"row",
      justifyContent:"space-between",
    },
    chat:{
      flexDirection:"row",
      justifyContent:"space-between",
    },
    notify:{
      flexDirection:"row",
      justifyContent:"space-between",
    },
   privacy:{
      flexDirection:"row",
      justifyContent:"space-between",
    },
   dataUsage:{
      flexDirection:"row",
      justifyContent:"space-between",
    }
})
