import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import SendTalpFromClient from '../screens/SendTalpFromClient';
import Home from '../screens/Home';
import ShowClient from '../screens/ShowClient';
import ShowSanai3y from '../screens/ShowSanai3y';
import WorksForm from '../screens/WorksForm';
import Works from '../screens/Works';
const { Navigator, Screen } = createStackNavigator();
export default function HomeStack() {
  return (

    <Navigator>
      <Screen
        name='HomePost'
        component={Home}
        options={{
          headerLeft:false,
          title: 'المنشورات',
          headerBackTitleVisible:false,
          headerStyle: {
            backgroundColor: "#fbb150",
            elevation: 15,
            shadowColor: "#000"
          },
          headerTitleAlign: 'center',
          headerTintColor: '#000'

        }} />

      <Screen name='SendTalp' component={SendTalpFromClient}
        options={
          {
            headerTitle: "الطلب",
            // headerTitleAlign:"left",
            // headerBackTitleStyle:{
            //   textAlign:"right",
            //   justifyContent:"flex-end"
            // }
          }
        }
      />

      {/* Show Client */}
      <Screen name='ClientShow' component={ShowClient}
        options={
          {
            // headerShown:false
            headerTitle: "عميل",
            // headerTitleAlign:"left",
            // headerBackTitleStyle:{
            //   textAlign:"right",
            //   justifyContent:"flex-end"
            // }
          }
        }
      />
   
        
   
   
      
    </Navigator>
  )
}