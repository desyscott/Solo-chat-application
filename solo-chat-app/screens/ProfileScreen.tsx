import React,{useState,useEffect,useLayoutEffect} from 'react'
import { View, 
        Text,
        StyleSheet,
        TextInput, 
        TouchableOpacity,
        Button,
        Image,
        Modal,
        Dimensions,
        Pressable,
        } from 'react-native'
import { Ionicons,AntDesign,MaterialIcons } from '@expo/vector-icons';
import {EditProfileHeader} from "../components/EditProfileHeader"
import {auth,db,storage} from "../Firebase"
import { useNavigation } from '@react-navigation/core';
import * as ImagePicker from 'expo-image-picker';
import {fetchUser} from "../components/Redux/index"
import {connect} from "react-redux";

const HEIGHT =Dimensions.get('window').height;



const ProfileScreen = ({currentUser,fetchUser}) => {
    const navigation= useNavigation()
  
    useLayoutEffect(()=>{
      navigation.setOptions({
        headerTitle:()=><EditProfileHeader image={image}/>,
        headerBackTitleVisible: false,
        headerStyle:{
           backgroundColor: "#fff"
        },
      
      })
    })
    
const [image,setImage]=useState(null)

const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
const [showModal,setShowModal]=useState(false)



 
 useEffect(() => {
    (async () => {
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGalleryPermission(galleryStatus.status === 'granted')
    
    })();
   
  }, []);
 
 
 ///////////////////////////////////////////////////////////////fetching  data from redux state/////////////////////////////////////////////////////////////
  useEffect(()=>{
   fetchUser() 
  },[]) 
 
  
 
 
  if (hasGalleryPermission===null) {
    return <View />;
  }
  if (hasGalleryPermission===false) {
    return <Text>No access to camera</Text>;
  }
 
  const pickImage = async () => {
    try{
      let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }catch(error){
    console.log(error.message)
  }
  };
  

    return (
        <View  style={styles.container} >
           <Pressable style={styles.editPhoto} onPress={()=>setShowModal(true)}>
           {image ? (
    
          <View style={styles.avatarImg}>
            <Image
              source={{ uri: image }}
              style={{ width:95, height: 95, borderRadius: 50 }}
            />
           
          </View>
         
        
      ):(
            <View style={styles.avatarImg}>
            <Image source={{uri:currentUser && currentUser.photoURL || "https://www.sandcanyoncc.com/wp-content/uploads/elementor/thumbs/no-profile-picture-icon-15-omqilctwnnaw5c9dnu5i4bvw9ui5vymmtjrwsaz3q0.png"}}
        style={{ width:95, height: 95, borderRadius: 50 }}
      />
      
        </View>)}
     
       <Text style={{fontSize:15,fontWeight:"bold",color:"#3777f0",marginTop:10}}>Edit Profile Photo</Text>
       </Pressable>
       <Modal visible={showModal} transparent>
       <View style={styles.modalBg} >

       <Pressable style={styles.modalContent} >
       <Pressable onPress={() => setImage(null)}>
       <Text  style={styles.modalText}>Remove Current Photo</Text>
       </Pressable>
       <View style={styles.modalHoriLine}/>
       <Pressable onPress={() =>navigation.navigate("camera")}>
       <Text  style={styles.modalText}>Take Photo</Text>
       </Pressable>
       <View style={styles.modalHoriLine}/>
       <Pressable  onPress={pickImage}>
       <Text  style={styles.modalText}>Choose From Library</Text>
       </Pressable>
      
       </Pressable>
      
       <Pressable style={styles.closeModalContent} onPress={()=>setShowModal(false)}>
       <Text style={[styles.modalText,{fontWeight:"bold",}]}>Cancel</Text>
       </Pressable>
       </View>
       
       </Modal>
       
       
       
        <View style={styles.profileInfo}>
        <TouchableOpacity style={styles.profileName} onPress={() => navigation.navigate("Edit Name")} >
        <View style={{flexDirection:"row"}}>
        <Ionicons name="person-outline" size={24} color="black" />
        <Text  style={{marginLeft:15, fontWeight: "bold" ,fontSize:17}}>{currentUser && currentUser.displayName}</Text>
        </View>
        
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#8E959B" /> 
        </TouchableOpacity>
        <View style={styles.horiLine}/>
        
        <TouchableOpacity style={styles.profileDesc} onPress={() =>navigation.navigate("About")}>
        <View  style={{flexDirection:"row"}}>
        <AntDesign name="edit" size={28} color="black" />
        {currentUser && currentUser.about ? (<Text style={{marginLeft:15}}>{currentUser.about}</Text>)
         :
         (
        <Text style={{marginLeft:15}}>About</Text>
        )
        }
        </View>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#8E959B"/> 
    
        </TouchableOpacity>
        </View>

        
        
        
       
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

export default connect(mapStateToProps,mapDispatchToProps)(ProfileScreen)

const styles = StyleSheet.create({
    container:{
          alignItems: 'center',
          backgroundColor:"lightgrey",
          flex:1,
    },
    avatarImg:{
        borderRadius:50, 
        width: 95,
       height: 95,
       backgroundColor: "#8E959B",
       marginTop:30,
      justifyContent: "center",
       alignItems: "center"    
    },
    editPhoto:{
        justifyContent: "center",
        alignItems: "center"
    },
    modalBg:{
        backgroundColor: "rgba(0,0,0,0.4)",
        flex: 1,
        justifyContent: "flex-end",
    },
    modalContent:{
        alignItems: "center",
        justifyContent:"space-between",
        padding: 20,
        height:HEIGHT*.26,
        backgroundColor: "white",
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
    modalText:{
        fontSize:16.5,
        color:"#3777f0"
    },
    closeModalContent:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent:"center",
        padding: 10,
        height: 50,
        backgroundColor: "white",
        marginHorizontal: 10,
        marginBottom: 15,
        borderRadius: 10,
    },
    modalHoriLine:{
       width:300,
        height:.3,
        backgroundColor: "grey",
        marginHorizontal:50,
    },
    profileInfo:{
        backgroundColor: "#fff",
        marginTop:30,
        width:350,
        height:95,
        borderRadius:10,
       
    },
    profileName:{
        flexDirection:"row",
        padding: 10,
        justifyContent: "space-between",
        
    },
    profileDesc:{
        flexDirection:"row",
        padding: 10,
        justifyContent: "space-between",
    },
    horiLine:{
        width:300,
        height:1,
        backgroundColor: "#8E959B",
        marginHorizontal:50,
    },
   
})

 