
import React, { useState,useEffect} from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { auth, db } from "../Firebase";
import {Input} from "react-native-elements"
const HEIGHT =Dimensions.get('window').height;

export default function EditNameScreen({ navigation }) {
  
  
  const [newName, setNewName] = useState("");
  const [showModal, setShowModal] = useState(true);
  

  //fetch user data from firebase////////////////////////
  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(auth?.currentUser?.uid)
      .onSnapshot((doc) =>  setNewName(doc?.data()?.displayName));
    return unsubscribe;
  }, []);
  

  //Function to update user name//////////////////////////////
  const updateUserName = (newName) => {
    auth.currentUser
      .updateProfile({
        displayName: newName,
      })
      .then(() => {
        db.collection("users")
          .doc(auth.currentUser.uid)
          .update({
            displayName: newName,
          })
          .catch((error) => alert(error));
        alert("Username updated");
        navigation.goBack();
      })
      .catch((error) => alert(error));
  };
  /////////////////////////////////////////////////////////

  //
  const onEditUsername = () => {
    if (newName) {
      updateUserName(newName);
    } else {
      alert("Enter a valid user name");
    }
  };
  //

  return (
      
    <Modal visible={showModal}   transparent={true} animationType="slide">
    
    <SafeAreaView style={styles.modalBg}>

     <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={[styles.headerText,{color:"#3777f0"}]}>Cancel</Text>
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerText,{fontWeight:"bold"}]}>Your Name</Text>
          </View>
          
        
        {newName?(<TouchableOpacity
        activeOpacity={0.5}
      
        onPress={() => onEditUsername()}
      >
        <Text style={[styles.headerText,{color:"#3777f0",fontWeight:"bold"}]}>Done</Text>
      </TouchableOpacity>):(
        <View>
         <Text style={[styles.headerText,{color:"#d3d3d3",fontWeight:"bold"}]}>Done</Text>
         </View>
      )
      }
       </View>
       <View style={{borderBottomWidth:.5}}/>
      
       
       

        <View style={{ paddingTop: 100,flex:1,backgroundColor:"#ececec"}}>
        <Text style={{fontSize:14,color:"#000",marginLeft:12,letterSpacing:2}}>Username</Text>
          <View style={styles.inputContainer}>
            <Input
              style={styles.input}
              placeholder={newName}
              onChangeText={(text) => setNewName(text)}
              value={newName}
            />
          </View>
        </View>
        </View>

      
    </SafeAreaView>
 
    </Modal>
   
  );
}

const styles = StyleSheet.create({
  modalBg: {
   backgroundColor: "rgba(0,0,0,0.4)",
   height:HEIGHT*.58,
    flex: 1.8,
    justifyContent: "flex-end",
  },
  modalContent:{
    flex: 1,
    justifyContent: 'center', 
     backgroundColor: "#fff",
    borderRadius:20,
  },
  modalHeader:{
    flexDirection:"row",
    justifyContent:"space-between",
    padding:20,
        //  backgroundColor: "pink"
  },
  headerText:{
    fontSize:16.5,
  },
  
  inputContainer: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    
  },
  input: {
    fontSize: 18,
    paddingHorizontal: 10,
    borderColor:"transparent"
    
  },
  
});
