import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Button,Image,Platform} from 'react-native';
import { Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';

export default function CameraScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const  cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
      
    
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGalleryPermission(galleryStatus.status === 'granted')
    
    })();
  }, []);
  
  const takePicture=async()=>{
    if(camera){
      const data = await camera.takePictureAsync(null);
      console.log(data.uri)
      setImage(data.uri)
    }
  }
  
  const pickImage = async () => {
    try{
      let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
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

  if (hasCameraPermission === null || hasGalleryPermission===false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission===false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{flex:1}}>
    <StatusBar style="auto"/>
    <View style={{flex:1,flexDirection:"row"}}>
      <Camera style={{flex:1,aspectRatio:1}} ratio={"1.1"} type={type} ref={(ref)=>setCamera(ref)}/>
      </View>
     
          <Button
        title="flip camera"
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
           
          </Button>
          <Button title="take picture" onPress={() => takePicture()}/>
          <Button title="Pick an image from camera roll" onPress={pickImage}/>
       
          {image && <Image source={{uri:image}} style={{flex:1}}/>}
         
        
        </View>
      
   
  );
}
