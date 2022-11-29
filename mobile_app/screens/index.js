import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, Header } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fragment } from 'react';
import { Provider, useDispatch } from 'react-redux';
import Login from '../screens/Login';
import Messages from './Messages';
import RegisterationStack from '../navigation/RegisterationStack';
import MainTabs from '../navigation/HomeScreen'
import { getDataClient } from '../Redux/Slices/ClientReducer';
import { getDataSnai3y } from '../Redux/Slices/Snai3yReducer';
import { useState } from 'react';
import { useEffect } from 'react';
import IntuoialScreen from './IntouialScrean';
import {useSelector} from "react-redux";
import { getImageUrl } from '../Config/imageUrl';
import { getDataJops } from '../Redux/Slices/JobsReducer';

export default function Index() {

  const currentReciever = useSelector((state) => state.currentRecieverReducer.currentReciever)
  const Stack = createStackNavigator()
  const dispatch = useDispatch()
  useEffect(() => {
    // AsyncStorage.clear()
  
    AsyncStorage.getItem('snai3yRole').then(res => 
      {
      if(res == "client")
      {
        console.log("client dispatch");
        return AsyncStorage.getItem('id').then(result =>
          console.log(result)
          // dispatch(getDataClient(result))
          )
      }
      else if(res == "sanai3y") 
      {
        console.log("sni3y dispatch");
        return AsyncStorage.getItem('id').then(result => dispatch(getDataSnai3y(result)))
      }
      else{
        return false
      }
      // 
    }
    )
    dispatch(getDataJops())
  }, [])
  // console.log(route)


  return (
      <>

        <NavigationContainer>
            <Stack.Navigator initialRouteName={"startApp"}>
              <Stack.Screen name='startApp' component={IntuoialScreen}
                options={{
                  headerShown: false
                }}
              />
              <Stack.Screen name='login' component={Login}
                options={{
                  headerShown: false
                }}
              />
              <Stack.Screen name='Home' component={MainTabs}
                options={{
                  headerShown: false
                }}
              />
              <Stack.Screen name='register' component={RegisterationStack}
                options={{
                  headerShown: false,
                  headerBackVisible: false,
                }}
              />

            <Stack.Screen name='messages' component={Messages}
              // options={{
              //   // headerShown: false,
              //   // headerBackVisible: false,
              // }}
              options={{
                title: (<View style={styles.header_title}>
                  <Text style={styles.reciever_name}>{`${currentReciever.firstName} ${currentReciever?.lastName}`}</Text>
                  <Image style={styles.reciever_image} source = {{ uri: currentReciever.img }}/>
                </View>), 
                headerStyle: {
                  backgroundColor: "#fbb150",
                  elevation: 50,
                  shadowColor: "#000000ff",
                  height: 90
                },
                headerTitleAlign: 'right',
                headerTintColor: '#000'
      
      
                }}
            />
            </Stack.Navigator>
          </NavigationContainer>
          
      </>
   )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  header_title: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  reciever_name: {
    fontSize: 20,
    // backgroundColor: "red",
    paddingHorizontal: 10,
    marginHorizontal: 20,
    fontWeight:"500"
  },
  reciever_image: {
    width: 40, 
    height: 40, 
    borderRadius: 60,
  }
});
