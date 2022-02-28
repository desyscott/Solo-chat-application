import React,{ useState,useEffect} from 'react'
import { View, Text,StyleSheet } from 'react-native'
import {connect} from "react-redux"
import {fetchUser} from "../components/Redux/index"

const WelcomeScreen = ({currentUser ,fetchUsers}) => {
    useEffect(()=>{
        fetchUsers()
    },[])
    
    
    console.log(currentUser)
    if(currentUser===undefined){
       return( <View></View>)
    }
    
    
    return (
        <View style={{flex:1,justifyContent: 'center',alignItems: 'center',backgroundColor:"#fff"}}>
            <Text>{currentUser && currentUser.name} is you are welcome</Text>
            <Text>{currentUser && currentUser.email} is you are welcome</Text>
         
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
        fetchUsers:()=>dispatch(fetchUser()) 
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(WelcomeScreen)

// const styles = StyleSheet.create({
//     backgroundColor:"#fff",
//     flex: 1,
// })
