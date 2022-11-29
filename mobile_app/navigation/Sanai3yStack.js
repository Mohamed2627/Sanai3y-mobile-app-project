import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import AllUser from "../screens/AllUser";
import ShowSanai3y from "../screens/ShowSanai3y";
import { FontAwesome } from '@expo/vector-icons'

const Sanai3yStack = () => {
    const { Navigator , Screen} = createStackNavigator()
  return (
    <Navigator>
        <Screen
        name="الصنايعية"
        component={AllUser}
        options={{
          headerLeft:false,
          headerTitle:"جميع الحرفيين",
          headerTitleAlign:"center",
          headerStyle:{
            backgroundColor: "#fbb150",
            elevation: 15,
            shadowColor: "#000"
          }
      
        }}
      />
        <Screen name='Sanai3yShow' component={ShowSanai3y}
       options={
         {
          headerTitle:"حرفي",
          headerTitleAlign:"center",
          headerStyle:{
            backgroundColor: "#fbb150",
            elevation: 15,
            shadowColor: "#000"
          }
         }
       }
       />
        
    </Navigator>
  )
}

export default Sanai3yStack