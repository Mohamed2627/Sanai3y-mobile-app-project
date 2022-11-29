import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TalpatSendingWithSanai3y from "../screens/TalpatSendingWithSanai3y";
import ProfileClient from "../screens/ProfileClient";
import EditeJobsWithClient from "../screens/EditeJobsWithClient";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { DevSettings, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import EditProfileClient from "../screens/EditProfileClient";
import ShowSanai3y from "../screens/ShowSanai3y";

const ProfileClientStack = () => {
  const { Navigator, Screen } = createStackNavigator();
  const navigation = useNavigation()
function test() {

  AsyncStorage.clear();
  // DevSettings.reload()  
  navigation.replace('login')

}


  return (
    <Navigator>
      <Screen
        name="profileClient"
        component={ProfileClient}
        options={{
          headerLeft: () => (
          <TouchableOpacity>
            <AntDesign name="login" style={{paddingRight:20, fontSize:20}} 
            onPress={() => test()}
            
            />
          </TouchableOpacity>
          ),
          headerTitle: "الصفحة الشخصية",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#fbb150",
            elevation: 15,
            shadowColor: "#000"
          },
          headerStyle: {
            backgroundColor: "#fbb150",
            elevation: 15,
            shadowColor: "#000",
          },
        }}
      />
      <Screen
        name="talpatSending"
        component={TalpatSendingWithSanai3y}
        options={{
          headerTitle: "الطلبات المقدمة",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 25,
          },
          headerStyle: {
            backgroundColor: "#fbb150",
            elevation: 15,
            shadowColor: "#000",
          },
        }}
      />
      <Screen
        name="editeJobs"
        component={EditeJobsWithClient}
        options={{
          headerTitle:'تعديل المنشور',
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 25,
          },
          headerStyle: {
            backgroundColor: "#fbb150",
            elevation: 15,
            shadowColor: "#000",
          },
        }}
      />
      <Screen
        name="editDataClient"
        component={EditProfileClient}
        options={{
          headerTitle:'تعديل البيانات',
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 25,
          },
          headerStyle: {
            backgroundColor: "#fbb150",
            elevation: 15,
            shadowColor: "#000",
          },
        }}
      />
      <Screen
        name="sani3yShow"
        component={ShowSanai3y}
        options={{
          headerTitle:'حرفي',
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 25,
          },
          headerStyle: {
            backgroundColor: "#fbb150",
            elevation: 15,
            shadowColor: "#000",
          },
        }}
      />
    </Navigator>
  );
};

export default ProfileClientStack;
