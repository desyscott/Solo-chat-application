import React,{ useState,useEffect} from "react";
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Pressable
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Text ,Input} from "react-native-elements"
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../Firebase";
import {Formik} from "formik";
import * as Yup   from "yup";
import Validator  from "email-validator"
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-gesture-handler";

const LoginScreen = () => {
  const [secureEye, setSecureEye ]= useState(true);

 const SignInSchema=Yup.object().shape({
   email:Yup.string().email().required("email is required"),
   password:Yup.string().required()
 })


  const navigation =useNavigation()
  

  const handleSignIn = async (email, password) => {
    try {
      const userCredentials = await auth.signInWithEmailAndPassword(
        email,
        password
      );
      navigation.replace("Home");

      await db.collection("users").doc(userCredentials.user.uid).update({
          isOnline: true,
        })
    
    } catch (error) {
      alert(error.message);
    }
  };
  
 
  return (
    
    < KeyboardAvoidingView   behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.container}>
    <StatusBar style="inverted"/>


    
      <View style={styles.circle} />
      <View style={{ height: 60 }} />
      <View>
        <Image
          source={{uri:"https://cdn.icon-icons.com/icons2/806/PNG/512/chat-26_icon-icons.com_65943.png"}}
          style={{ height: 140, width: 140, alignSelf: "center" ,    marginBottom: 20,  marginTop:85,}}
        />
      </View>
    
      <Formik 
      initialValues={{email:"",password:""}}
      validationSchema={SignInSchema}
      validateOnMount={true}
      onSubmit={(values,action)=>{
        handleSignIn (values.email, values.password)
        console.log(values)
        action.resetForm()
      }}>
      
      {({values,handleChange,handleSubmit,handleBlur,errors,touched,isValid})=> (
        <>
          <Text style={{color:"red"}}>{touched.email  && errors.email || touched.password && errors.password}</Text>
   <View style={styles.inputContainer}>
      <Input
        style={[styles.textInput,{
          borderBottomWidth:1.5,borderColor:values.email.length >1 ||   Validator.validate(values.email) ? "#ccc":"red"}]}
        placeholder="Enter your email"
        autoFocus={true}
        value={values.email}
        onChangeText={handleChange("email")}
        onBlur={handleBlur("email")}
      />
     
  
      <Input
        style={[styles.textInput]}
        placeholder="Enter your password"
        value={values.password}
        secureTextEntry={secureEye}
        onChangeText={handleChange("password")}
        onBlur={handleBlur("password")}
        rightIcon={
          <>
         {secureEye ? (<Pressable onPress={()=>setSecureEye(!secureEye)}>
          <Ionicons name="ios-eye-outline" size={20} color="black" />
          </Pressable>)
          : (
            <Pressable onPress={()=>setSecureEye(!secureEye)}>
          <Ionicons name="ios-eye-off-outline" size={20} color="black" />
          </Pressable>
          )
        }
         </>
         
        }
      />

      <Pressable  style={{flexDirection:"row",justifyContent: "flex-end",marginBottom:10}}>
        <Text style={{color:"#3777f0"}}>Forget password</Text>
        </Pressable>
      </View>
    
     
      
        <TouchableOpacity
          style={[styles.Btn(isValid),{ marginBottom: 20 }]}
          disabled={!isValid}
          onPress={ handleSubmit}
        >
        <Text style={{color:"#fff",fontSize:16}}>Sign in</Text>
        </TouchableOpacity>
        
     
      <TouchableOpacity
          style={[styles.Btn(isValid),{backgroundColor:"#ffff",borderColor:"#3777f0",borderWidth:2, }]}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={{ fontSize: 16,color:"#3777f0" }}>
           Don't have an account? Sign up
          </Text>
         
        </TouchableOpacity>
        </>
        )}
        </Formik>
      
        <View style={{ height:130}}/>
      
    </ KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
    alignItems: "center",
    justifyContent: "center",
    padding:10,


  },
  circle: {
    width: 500,
    height: 500,
    borderRadius: 500 / 2,
    backgroundColor: "#fff",
    position: "absolute",
    left: -100,
    top: -18,
  },

  inputContainer: {
    width: 300,
  },
  textInput:{
    fontSize: 18,
    padding: 10,
  },
  
Btn:(isValid)=>({
    backgroundColor:isValid? "#3777f0": "#6BB0E5",
    justifyContent: "center",
    alignItems: "center",
   borderRadius: 5,
   padding:10,
   width: 300,
}),

});
