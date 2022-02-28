import React from 'react'
import { View, Text,StyleSheet,Image,Pressable,useWindowDimensions } from 'react-native'
import { auth } from '../../Firebase'


const blue="#3777f0" 
const Grey="lightgrey"


const Message = ({id,message,user1}) => {
    const { width } = useWindowDimensions();

    const {
        timeStamp,
        email,
        name,
        userId,
        photoURL,
        To,
        From,
       content,
       imageContent
      } = message?.data;
      const time = timeStamp
      ?.toDate()
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });``
          const isMe =  From === user1;
          const Me =  name === auth.currentUser?.displayName;
        

    return (
        <Pressable key={id} style={[styles.container, isMe || Me ? styles.senderContainer : styles.receiverContainer]}>
           {imageContent && (
        <View style={{ marginBottom: content ? 10 : 2,  }}>
          <Image
            source={{ uri:  imageContent }}
            style={{
                // height:100,
              width: width * 0.7,
              aspectRatio: 4 / 3,
            }}
            resizeMode="contain"
          />
        </View>
      )}
      {content && <Text style={[{color:isMe ||Me ?"#000":"#fff",fontSize:16.5}]}>{content}</Text>}
            <View style={{flexDirection:"row",justifyContent:"flex-end"}}>
            <Text style={[{color:isMe ||Me ?"#5b5b5b":"#fff",fontSize:12}]}>{time}</Text>
            </View>
        </Pressable>
    )
}


const styles = StyleSheet.create({
   container:{
        padding: 10,
        margin: 10,
        borderRadius: 10,
        maxWidth: "75%"
          },
  receiverContainer:{
        backgroundColor: "#3777f0",
        marginRight:"auto",
        marginLeft:10,
        
    },
   senderContainer:{
        backgroundColor: "#d3d3d3",
        marginLeft:"auto",
        marginRight:10,
     
    }
})


export default Message