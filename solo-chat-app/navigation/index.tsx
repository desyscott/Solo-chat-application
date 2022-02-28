/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome,Feather} from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from "@react-navigation/core";
import * as React from 'react';
import { ColorSchemeName, Pressable,View,Text, useWindowDimensions,SafeAreaView, ActivityIndicator } from 'react-native';
import {auth} from "../Firebase"
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabOneScreen from '../screens/HomeScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import ChatRoomScreen from './../screens/ChatRoomScreen';
import HomeScreen from '../screens/HomeScreen';
import HomeHeader from "../components/HomeChatRoom/HomeHeader"
import {ChatHeader} from "../components/Message/ChatHeader"
import LoginScreen from "../screens/LoginScreen"
import RegisterScreen from "../screens/RegisterScreen"
import SettingsScreen from "../screens/SettingsScreen"
import ProfileScreen from "../screens/ProfileScreen"
import ProfileInforScreen from "../screens/ProfileInforScreen"
import AddScreen from "../screens/AddScreen"
import AboutScreen from "../screens/AboutScreen"
import WelcomeScreen from "../screens/WelcomeScreen"
import EditNameScreen from "../screens/EditNameScreen"
import CameraScreen from "../screens/CameraScreen"

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const [currUser,setCurrUser]= React.useState(null)
  const [loading,setLoading]= React.useState(true)
  
  
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      setLoading(false)
         if(authUser){
        setCurrUser(authUser)
         }
  })
  //After We return unsubscribe to clear up the unsubscribe method
  return ()=> unsubscribe();
  },[])
  
  if(loading)
  return(
    <SafeAreaView style={{flex:1,
                          justifyContent: 'center',
                          alignItems:"center",
                          backgroundColor:"#fff"}}>
     
         <View>
         <ActivityIndicator size="large" />
         </View>
         
         </SafeAreaView>
         )
  return (
    <>
    {!currUser ? (
    <Stack.Navigator>
 <Stack.Screen name="login" component={LoginScreen} options={{header:()=>null, headerBackTitleVisible: false,
    
                                                               }}/>

 <Stack.Screen name="Register" component={RegisterScreen} options={{header:()=>null,headerBackTitleVisible: false,
    }}/>
    </Stack.Navigator>
    ):
     (
      <Stack.Navigator>
    
      <Stack.Screen name="Home" component={HomeScreen}  options={{
     headerTitle: () => <HomeHeader/>,
    headerStyle:{
      backgroundColor:"#fff"
    }}}/>
      
          <Stack.Screen name="ProfileInfor" component={ProfileInforScreen} options={{header:()=>null,headerBackTitleVisible: false,
    }}/>
     
    <Stack.Screen name="ChatRoom" component={ChatRoomScreen}  options={({route})=>({
       headerTitle: () => <ChatHeader chatName={route.params.chatName}  user={route.params.user} lastOnlineAt={route.params.lastOnlineAt}/>,
      
       headerBackTitleVisible: false,
       headerStyle:{
         backgroundColor: "#2c6bed",
        
       },
       headerTitleStyle: {
        color:"white"
      },
       headerTintColor:"white"
       
   
    })
   } />
     
       <Stack.Screen name="Settings" component={SettingsScreen} options={{headerBackTitleVisible: false,
                                                                          headerStyle:{  backgroundColor:"#fff",
                     
                                                                         },
                                                                    headerTitleStyle:{
                                                                     color:"#000"
                                                                    }
                                                                          }}/>
       
       <Stack.Screen name="Edit Profile" component={ProfileScreen}/>
       <Stack.Screen name="About" component={AboutScreen}/>
      <Stack.Screen name="Add" component={AddScreen} options={{headerBackTitleVisible: false}}/>
      <Stack.Screen name="Edit Name" component={EditNameScreen} options={{headerBackTitleVisible: false}}/>
      <Stack.Screen name="camera" component={CameraScreen} options={{
                                                                  headerStyle: {backgroundColor:"transparent"}}}/>
       <Stack.Screen name="welcome" component={WelcomeScreen} options={{headerBackTitleVisible: false}}/>
      </Stack.Navigator>
      )
     }
    </>
    
  )
}



function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}




