import React, { useState } from 'react'
import { View, Text, StyleSheet,TouchableOpacity,SafeAreaView,useWindowDimensions} from 'react-native'
import { useNavigation } from '@react-navigation/core';
import {auth,db,storage} from "../Firebase"
import firebase from "firebase/compat/app"



export const EditProfileHeader = ({image}) => {
    const { width } = useWindowDimensions();
    const navigation= useNavigation()
    
    
    
   //Upload image function///////////////////////
   const saveImage = async () => {
    const uri = image;
    const childPath = `profilePic/${auth.currentUser.uid}-${image.name}/`;//we create a users folder to contain the uid of each user that has made an upload

    const response = await fetch ( uri )
     const blob = await response.blob();//The blob will  transfer image url into an  actual image  and uploads it to firestore
    
   
                                                      
    const task = storage.ref().child(childPath).put(blob);
    
//The task  used to know the information/progress of the upload process
    const taskProgress = (snapshot) => {
      console.log(snapshot.bytesTransferred / snapshot.totalBytes);
    };

    const taskCompleted = () => {   //when task is complete we access the task directly and get the downloadUrl of the image
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        updateUserImage(snapshot);
      // console.log(snapshot.ref.fullPath);
      });
    };

    const taskError = (error) => {
      console.log(error.message);
    };
    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };
   
  ///////////////////////////////Function to update user image//////////////////////////////
  const updateUserImage = async(photoURL) => {
      await db.collection("users")
          .doc(auth.currentUser.uid)
          .update({
            photoURL:photoURL ,
            timeStamp:firebase.firestore.FieldValue.serverTimestamp()
          })
     navigation.goBack()     
  };
    
    
    
    return (
        <View style={{ flexDirection:"row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        width:width-100}}>
        <View>
        {/* <Text style={styles.text}>Cancel</Text> */}
        </View>
        <View>
        <Text style={[styles.text,{fontWeight:"bold"}]}>Edit Profile</Text>
        </View>
        

         {image?(<TouchableOpacity
        activeOpacity={0.5}
      
        onPress={()=>saveImage()}
      >
        <Text style={[styles.text,{color:"#3777f0",fontWeight:"bold"}]}>Done</Text>
      </TouchableOpacity>):(
        <View>
         <Text style={[styles.text,{color:"#d3d3d3",fontWeight:"bold"}]}>Done</Text>
         </View>
      )
      }
         </View>
    )
}



const styles = StyleSheet.create({
    container:{
       
    },
    text:{
      fontSize:17,
    }
    
})
