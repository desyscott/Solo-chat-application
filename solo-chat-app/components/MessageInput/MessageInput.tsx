import React,{useEffect, useState} from 'react'
import { 
        View,
        StyleSheet,
        TextInput,
        TouchableOpacity,
        Pressable, 
        Text,
        KeyboardAvoidingView,
        Platform, 
        Keyboard,
        Image
        } from 'react-native'
import { Ionicons,MaterialCommunityIcons,Feather} from '@expo/vector-icons';
import BottomSheet from "reanimated-bottom-sheet"
import Animation from "react-native-reanimated"
import { db,auth,storage} from '../../Firebase';
import firebase from "firebase/compat/app";
// import EmojiSelector from "react-native-emoji-selector";
import * as ImagePicker from "expo-image-picker";
import { Audio, AVPlaybackStatus } from "expo-av";
// import AudioPlayer from "../AudioPlayer";


const MessageInput = ({navigation,userID,user1,user2,user}) => {
  
         const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
          const [image, setImage] = useState(null);
            const [recording, setRecording] = useState();
            const [sound, setSound] = useState();
            const [pause, setPause] = useState(true);
            const [audioProgress, setAudioProgress] = useState(0);
            const [audioDuration, setAudioDuration] = useState(0);
            const [inputMessage,setInputMessage]=useState("")
               const [progress, setProgress] = useState(0);
            
//////////////////////////////////////////////////////////////////////////////////////////////////////////reset all field /////////////////////////////////////////////
             const resetFields = () => {
              setInputMessage("");
              setImage(null);
              setProgress(0);
            };
             
            
 //////////////////////////////////////////////////////////////////////////Requesting permission from image gallery//////////////////////////////////////////////
 useEffect(() => {
  (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted')
      //Getting permissions to use audio
      await Audio.requestPermissionsAsync();
  
  })();
}, []);

////////////////////////////////////////////////////conditions if  the permissions are not granted ///////////////////////////////////////////////////////////////
if ( hasGalleryPermission===null) {
  return <View />;
}
if ( hasGalleryPermission===false) {
  return <Text>No access to camera</Text>;
}

////////////////////////////////////////////////////////////fucnction to pick an image form gallery/////////////////////////////////////////////////////////////          
const pickImage = async () => {
  try{
    let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
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

//////////////////////////////////////////////////////Saving Image At storage  //////////////////////////////////////////////////////////////////////////////////////
   const uploadImage = async () => {
    const uri = image;
    const childPath = `ChatRoomsImages/${user2}/${Math.random().toString(36)}`;

    const response = await fetch ( uri )
    const blob = await response.blob();//The blob will  transfer image url into an  actual image  

    const task = storage.ref().child(childPath).put(blob);  //uploads the image to firestore storage

//The task  used to know the information/progress of the upload process
    const taskProgress = (snapshot) => {    
      setProgress(snapshot.bytesTransferred / snapshot.totalBytes);
      console.log(snapshot.bytesTransferred / snapshot.totalBytes);
    };

    const taskCompleted = () => {  //when task is complete we access the task directly and get the downloadUrl of the image
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        onSendMessage(snapshot);
      });
    };

    const taskError = (err) => {
      console.log(err);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  
 ////////////////////////////////////////////////////////////////////////////////Sending Messages///////////////////////////////////////////////////////////////////////            
            const onSendMessage=(imageURL)=>{
                
                const id=user1 > user2 ? `${user1 + user2}`:`${user2 + user1}`;
              
                db.collection("messages").doc(id ||userID).collection("chats").add({
                    content:inputMessage || null,
                    imageContent:imageURL || null,
                    From:user1 || userID,
                    To:user2,
                    FromTo:id,
                    displayName:auth.currentUser.displayName,
                    userId:auth.currentUser.uid,
                    photoURL:auth.currentUser.photoURL,
                    email:auth.currentUser.email,
                    timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
                
                db.collection("lastMessages").doc(id ||userID).set({
                    content:inputMessage || null,
                    imageContent:imageURL || null,
                    From:user1|| userID,
                    To:user2,
                    displayName:auth.currentUser.displayName,
                    userId:auth.currentUser.uid,
                    photoURL:auth.currentUser.photoURL,
                    timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                    unread:true
                })
            
                resetFields()
                Keyboard.dismiss()
            }

////////////////////////////////////////////////////////////////////////////Handling submission for Messages ////////////////////////////////////////// 
  const handleSendMessage =()=>{
    //if message is not equal to null/empty
    //if image is not equal to null/empty
    if (image ){
      uploadImage();
    }else if (inputMessage){
   onSendMessage();
    }
}

            
            
//////////////////////////////////////////////////Setting up recording for user/////////////////////////////////////////////             
const startRecording = async()=> {
    try {
      //Setting audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      console.log('Starting recording..');
      //Starting recording ..
      const { recording } = await Audio.Recording.createAsync(
         Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      //storing recording in the recording state
      setRecording(recording);
      console.warn('Recording started');
    } catch (error) {
      console.error('Failed to start recording', error.message);
    }
  }


//////////////////////////////////////////////////////////////////////the progress status of the audio////////////////////////////////////////////////
const   onPlaybackStatusUpdate=(status:AVPlaybackStatus)=>{
  console.log(status)
  if(!status.isLoaded){
    return
  }
  setAudioProgress(status.positionMillis / (status.durationMillis || 1))
  setPause(!status.isPlaying)
  setAudioDuration(status.durationMillis || 0 )
}

//function to stop the recording
 const stopRecording = async() => {
    console.warn('Stopping recording..');
    
    if(!recording){
      return;
    }
    setRecording(null);
     await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    }); 
    //we get the stop recording url
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); 
    
    if(!uri){
      return;
    }
    //// we store the recorded uri to the sound state
    const { sound } = await Audio.Sound.createAsync( {uri} ,{},onPlaybackStatusUpdate,);
   setSound(sound);
    
    const id=user1 > user2 ? `${user1 + user2}`:`${user2 + user1}`;
    db.collection('Recorded Messages').doc(id).set({
        recordedMgs:sound,
        From:user1|| userID,
        To:user2,
        displayName:auth.currentUser.displayName,
        userId:auth.currentUser.uid,
        photoURL:auth.currentUser.photoURL ,
        email:auth.currentUser.email,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        unread:true
    })
  }
 
 ////////////////////////////////////////////////////////////////////////////////function to play the sound////////////////////////////////////////////////////////
 const playPauseSound=async()=>{
   if(!sound){
     return;
   }
   if(pause){
     await sound.playFromPositionAsync(0); 
   }else{
    await sound.pauseAsync(); 
   }
   
 }
 
  // const handleSinglePress=()=>{
  //   console.warn(`hold to record, release to send`);
  // }
    return (
      <>
      {sound &&
 
       <View     style={styles.sendAudioContainer}>
       <Pressable  onPress={playPauseSound}>
   <Feather name={pause? "play":"pause"} size={24} color="black"  style={{marginLeft:10}}/>
   </Pressable>
   <View style={styles.audioProgressBar}>
   <View style={[styles.audioProgressFG,{left:`${audioProgress*100}%`}]}/>

   </View>
   <View>
   <Text>{audioDuration}</Text>
   </View>
       </View>
       
      
       
       }
       
      {image && 
       <>
    
        <View  style={styles.sendImageContainer} >
     <Image source={{uri:image}} style={{width:100,height:100,borderRadius:10}}/>
     <View style={{flex:1,justifyContent: 'flex-start',alignSelf:"flex-end"}}>
     <View
      style={{
        height: 3,
        width: `${progress * 100}%`,
        backgroundColor: "#3777f0",
        borderRadius: 5,
      }}
    />
    </View>
     <Pressable onPress={() =>setImage(null)} style={{padding:5}}>
      <Ionicons name="close" size={24} color="black" />
      </Pressable>
      </View>    
      </>
    }
        <KeyboardAvoidingView style={styles.container}
        keyboardVerticalOffset={100}
         behavior={Platform.OS ==="ios"?"padding":"height"}>
           
            <TouchableOpacity style={{marginLeft:10}} onPress={() =>pickImage()}>
            <Ionicons name="ios-add" size={30} color="#3777f0" />
            </TouchableOpacity>
           
            <TextInput 
             style={styles.textInput}
            placeholder="Type a message..." value={inputMessage} onChangeText={setInputMessage}/>

            {inputMessage || image?<Pressable style={styles.sendIcon} onPress={handleSendMessage}>
             <MaterialCommunityIcons name="send-circle" size={35} color="#3777f0" />
             </Pressable>
             : 
             <View style={styles.inputIcon}>
            <TouchableOpacity onPress={()=>navigation.navigate("camera")} >
            <Ionicons name="ios-camera-outline" size={26} color="#3777f0" />
            </TouchableOpacity>
            <Pressable style={{marginLeft: 10}} 
         onPressIn={startRecording}  onPressOut={stopRecording} 
            //  onLongPress={recording ? stopRecording : startRecording}
          >
            <MaterialCommunityIcons name={recording ? "microphone":"microphone-outline"}  size={28} color="#3777f0" />
            </Pressable>
            </View>}
        </KeyboardAvoidingView>
        </>
    )
}

export default MessageInput

const styles = StyleSheet.create({
    container:{
        height:70,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor:"lightgrey",
        padding:10,
        
     },
     sendImageContainer:{
      flexDirection:"row",
      justifyContent: "space-between",
      alignSelf:"stretch",
      borderWidth:1,
      marginLeft:55,
     borderColor:"lightgrey",
     // borderStyle: 'dashed',
     borderRadius:10
    },
     sendAudioContainer:{
       flexDirection:"row",
       alignItems: "center",
       justifyContent: "space-between",
      padding: 10,
      backgroundColor:"lightgrey",
      marginVertical:10,
      marginHorizontal:10,
      alignSelf:"stretch",
      borderRadius:10,
      borderWidth:1,
      borderColor:"lightgrey",
    },
    audioProgressBar:{
      height:3,
      flex:1,
      borderRadius:5,
      margin:10,
      backgroundColor: "#3777f0"
    },
    audioProgressFG:{
      width:10,
      height:10,
      borderRadius:10,
      backgroundColor: "#3777f0",
      
      position:"absolute",
      top:-4.5
    },
     
     textInput:{
        backgroundColor:"white",
        fontSize:17,
        borderRadius:30,
        borderColor:"transparent",
        width:"70%",
        height:"90%",
        padding:5,
        
     },
     inputIcon:{
        flexDirection:"row",
        width:"15%",
        justifyContent: "space-between",

     },
     sendIcon:{
        flexDirection:"row",
       justifyContent: "flex-end",
       marginRight:20,

     },
     
    
 })
 