import {StyleSheet} from "react-native"



export const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      padding: 10,
      paddingLeft: 20,
      paddingRight: 10,
    },
    img: {
      width: 60,
      height: 60,
      borderRadius: 50,
      marginRight: 10,
      paddingBottom:15,
      paddingTop:15,
    },
    textSection:{
      flex:1,
      justifyContent: "center",
      borderBottomWidth:.7,
      borderBottomColor:"#cccccc",
      marginLeft:10,
      paddingLeft:0,
      padding:5,
    },
    UserInfoSection: {
      flexDirection: "row",
      justifyContent: "space-between",
     marginBottom:10,
    },
    name: {
      fontWeight: "bold",
      fontSize:17,
    },
    text: {
      color: "grey",
      fontSize:15,
    },
text2:{
  color: "#1688E2",
  fontSize:15,
    },
    messages: {
      color: "grey",
      paddingBottom: 10,
   
    },
    notifyBagde: {
      position: "absolute",
      right: 10,
      bottom:23,
      zIndex: 9999,
      backgroundColor: "#1688E2",
      maxWidth:"100%",
      height: 20,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      marginLeft: 5,
 
    },
    
  });
  