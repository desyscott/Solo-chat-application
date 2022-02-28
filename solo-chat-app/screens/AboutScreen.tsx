import React,{ useState,useEffect} from 'react'
import { View, Text,Modal,StyleSheet, Button,Dimensions,Pressable,SafeAreaView} from 'react-native'
import { Input } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons';
import { db,auth} from '../Firebase'

import {fetchUser} from "../components/Redux/index"
import {connect} from "react-redux";


const HEIGHT =Dimensions.get('window').height;



const AboutScreen = ({currentUser,fetchUser}) => {
   
    const [newAbout,setNewAbout]=useState("")
    const [showModal,setShowModal]=useState(false)

    useEffect(()=>{
        fetchUser()
    },[])
    
    useEffect(() => {
       const subscribe = db.collection("users")
        .doc(auth.currentUser.uid)
        .onSnapshot((doc) => 
            setNewAbout(doc?.data()?.about)
        )
        return subscribe
    },[])
    
    const saveHandler=async()=>{
        await db.collection("users")
        .doc(auth.currentUser.uid)
        .update({
           about:newAbout
        }).then(()=>{
            setShowModal(false)
        }).catch((error)=>
                 console.log(error.message)
                 )
    
    }

    return (
        <SafeAreaView style={styles.container}>
          

     
          
            <View style={styles.aboutContainer}>
            <Text style={{paddingLeft:10}}>CURRENTLY SET TO</Text>
     <Pressable style={styles.about} onPress={()=>setShowModal(true)}>
        <Text style={styles.text}>{currentUser.about}</Text>
        <View >
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#8E959B" /> 
        </View>
        </Pressable>
            </View>
           



            <Modal visible={showModal} transparent={true} animationType="slide">
               <View style={styles.modalBg}>
                   <View style={styles.modalContent} >
                       <View style={styles.modalHeader}>
                           <Pressable onPress={()=>setShowModal(false)}>
                          <Text style={[styles.text,{color:"#3777f0"}]}>Cancel</Text>
                           </Pressable>
                           <View><Text style={[styles.text,{fontWeight:"bold"}]}>About</Text></View>
                           <Pressable onPress={saveHandler}>
                               {newAbout ?
                               (<Text style={[styles.text,{fontWeight:"bold",color:"#3777f0"}]}>Save</Text>)
                               :
                               ( <Text style={[styles.text,{fontWeight:"bold",color:"#d3d3d3"}]}>Save</Text>)
                               }
                       
                          
                           </Pressable>
                        
                        </View>
                        <View style={{height:20,backgroundColor:"#f0f0f0"}}/>
               
               <View style={styles.inputContainer}>
                   <Input value={newAbout} onChangeText={(text) => setNewAbout(text)} placeholder={newAbout}/>
                 </View>
                    
                       </View>
                    
               </View>
            </Modal>
           
        </SafeAreaView>
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
  

export default connect(mapStateToProps,mapDispatchToProps)(AboutScreen)

const styles= StyleSheet.create({
    container:{
        backgroundColor:"#f0f0f0",
        flex:1,
      
    },
    modalBg:{
        backgroundColor: "rgba(0,0,0,0.4)",
        flex: 1,
        justifyContent: "flex-end",
    },
    modalContent:{
        height:HEIGHT*.93,
      alignContent:"center",
        backgroundColor: "white",
        borderRadius: 20,
    },
    modalHeader:{
           flexDirection:"row",
           justifyContent:"space-between",
           alignItems:"center",
           padding:20,
           backgroundColor: "#fff",
        borderRadius: 20,

    },
    inputContainer:{
marginTop:50,
    },
   
    aboutContainer:{
marginTop:50,


    },
    about:{
    flexDirection:"row",
    padding:10,
    marginVertical:10,
    justifyContent:"space-between",
    backgroundColor:"#fff"},
   
    text:{
   fontSize:17,
    }
})
