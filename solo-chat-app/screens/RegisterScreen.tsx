import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Text,Input} from "react-native-elements";
import { useNavigation } from "@react-navigation/core";
import { auth, db } from "../Firebase";
import moment from "moment";
import firebase from "firebase/compat/app";
import {Formik} from "formik";
import * as Yup   from "yup";
import Validator  from "email-validator"
import { StatusBar } from "expo-status-bar";



const  SignUpScreen = () => {
  
  const navigation = useNavigation();
  const [secureEye, setSecureEye ]= useState(true);
  
  
  const SignUpSchema=Yup.object().shape({
    name:Yup.string().required("username is required").min(3),
    email:Yup.string().email().required(" email is required"),
    password:Yup.string().required().min(6,"Your password must be at least 6 characters"),
  })


 ///////////////////////////////////////////////////////////////////////////////////SignUp Handler using FIrebase////////////////////////////////////////////////////
  const handleSignUp = async (email,password,name) => {
    await auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: name,
        });
        console.log( authUser.user)
        db.collection("users").doc(auth.currentUser.uid).set({
          displayName:name,
          email,
          photoURL:"https://www.sandcanyoncc.com/wp-content/uploads/elementor/thumbs/no-profile-picture-icon-15-omqilctwnnaw5c9dnu5i4bvw9ui5vymmtjrwsaz3q0.png",
          userId: auth.currentUser.uid,
          isOnline:true,
          lastOnlineAt: moment().format(),
          createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        })
        navigation.replace("Home")
  })
  .catch((error) => alert(error.message));
}
 

  return (
      <KeyboardAvoidingView style={styles.container}
         behavior={Platform.OS ==="ios"?"padding":"height"}>
     <StatusBar style="inverted"/>
        <View style={styles.circle} />
        <View style={{ height: 70 }} />
       
     
          <Text h3 style={styles.header}>
            Create an account
          </Text>
     
     
     <Formik
     initialValues={{email:"", password:"",name:""}}
     validationSchema={SignUpSchema}
     validateOnMount={true}
     onSubmit={(values,action)=>{
      handleSignUp(values.email,values.password,values.name)
      console.log(values)
      
      action.resetForm()
     }}
 
     >
      
        {({handleSubmit,handleChange,values,errors,handleBlur,touched,isValid})=>(
           <>
              <Text style={{color: "red"}} >{touched.name && errors.name || touched.email &&  errors.email || touched.password && errors.password}</Text>
          <View style={styles.inputContainer}>
        <Input
          style={[styles.textInput,{
            borderBottomWidth:1.5,borderColor:values.name.length >3 ? "#ccc":"red" }]}
          placeholder="Username"
          autoFocus={true}
          value={values.name}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
        />

        <Input
          style={[styles.textInput ,{
            borderBottomWidth:1.5,borderColor:values.email.length < 1  ||  Validator.validate(values.email) ? "#ccc":"red" }]}
          placeholder="Enter your email"
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCapitalize="none"
          value={values.email}
          onChangeText={
          handleChange("email")}
          onBlur={handleBlur("email")}
          
        />
        

        <Input
          style={[styles.textInput,{
          borderColor:  values.password.length  >6  ? "#ccc":"red" }]}
          placeholder="Enter your password"
          value={values.password}
          secureTextEntry={secureEye}
          autoCorrect={false}
          autoCapitalize="none"
          textContentType="password"
          onSubmitEditing={handleSubmit}
          onChangeText={ handleChange("password")}
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
        </View>

        

    
          <TouchableOpacity
            style={[styles.Btn(isValid) ,{ marginBottom: 20 }]}
            disabled={!isValid}
            onPress={handleSubmit}
          >
                 <Text style={{color:"#fff",fontSize:16}}>Create an account </Text>
          </TouchableOpacity>
    

        <TouchableOpacity
          style={[styles.Btn(isValid), {backgroundColor:"#ffff",borderColor:"#3777f0",borderWidth:2,    marginBottom: 10 ,}]}
          onPress={() => navigation.navigate("login")}
        >
          <Text style={{ fontSize: 16,color:"#3777f0" }}>
          Have an account ? Sign in
          </Text>
        </TouchableOpacity>
       </>
         ) }
      </Formik>
   
      </KeyboardAvoidingView>
  
     
 
  );
};

export default SignUpScreen;

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
  header: {
    fontWeight: "bold",
    color: "#514E5A",
    marginBottom: 30,
  },
  textInput:{
        fontSize: 17,
        padding:5,
        // borderBottomWidth:1.5,
 
  },
  inputContainer: {
    width: 300,
  },

  Btn:(isValid)=>({
    backgroundColor:isValid? "#3777f0" :"#6BB0E5",
    justifyContent: "center",
    alignItems: "center",
   borderRadius: 5,
   padding:10,
   width: 300
  }),
  
});


