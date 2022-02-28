import React,{ useEffect} from 'react'
import { View, Text,Pressable,useWindowDimensions,TextInput,StyleSheet,Image} from 'react-native'
import { useNavigation } from "@react-navigation/core";
import { FontAwesome,Feather,Ionicons} from '@expo/vector-icons';
import {auth} from "../../Firebase"
import {fetchUser} from "../Redux/index"
import {connect} from "react-redux"


 const HomeHeader = ({currentUser,fetchUser}) => {
    const { width } = useWindowDimensions();
    const navigation = useNavigation()
    
    useEffect(() => {
      fetchUser()
    },[])
    console.log(currentUser && currentUser.downloadURL)
    if(currentUser===undefined){
      return<View></View>
    }
  
    return (
        <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width,
          alignItems: "center",
        }}
      >
      <Pressable onPress={() => navigation.navigate("Settings")}>
      <Image source={{uri:currentUser && currentUser.photoURL || "https://www.sandcanyoncc.com/wp-content/uploads/elementor/thumbs/no-profile-picture-icon-15-omqilctwnnaw5c9dnu5i4bvw9ui5vymmtjrwsaz3q0.png"}}
        style={{ width: 40, height: 40, borderRadius: 50 ,marginLeft:10}}
      />
        </Pressable>
       
        
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            marginLeft: 50,
            fontWeight: "bold",
            fontSize:22,
          }}
        >
          Chats
        </Text>
        <Pressable >
          <Ionicons name="camera-outline" size={24} color="black" style={{ marginHorizontal: 10 }} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Add")}>
          <Feather
            name="edit-2"
            size={24}
            color="black"
            style={{ marginHorizontal: 20 }}
          />
        </Pressable>
        
      </View>
     </View>
    );
  };
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
 
 
  export default connect(mapStateToProps,mapDispatchToProps)(HomeHeader);

