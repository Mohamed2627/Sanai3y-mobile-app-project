import { View, Text, TouchableOpacity, DevSettings } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileSnai3y from "../screens/ProfileSnai3y";
import WorksForm from "../screens/WorksForm";
import Works from "../screens/Works";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import EditProfileSani3y from "../screens/EditProfileSani3y";
import Paypal from "../screens/Paypal";

const ProfileSani3yStack = () => {
  const { Navigator, Screen } = createStackNavigator();
  const navigation = useNavigation();
  function test() {
    AsyncStorage.clear();
    navigation.replace("login");
  }
  return (
    <Navigator>
      <Screen
        name="ProfileSnai3y"
        component={ProfileSnai3y}
        options={{
          headerTitle: "الصفحة الشخصية",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#fbb150",
            elevation: 15,
            shadowColor: "#000",
          },
          headerLeft: () => (
            <TouchableOpacity>
              <AntDesign
                name="login"
                style={{ paddingRight: 20, fontSize: 20 }}
                onPress={() => test()}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Screen
        name="ShowWorks"
        component={Works}
        options={{
          headerShown: true,
          headerTitleAlign:'center',
          headerTitle: "معرض الاعمال",
          headerStyle: {
            backgroundColor: "#fbb150",
            elevation: 15,
            shadowColor: "#000",
          },
        }}
      />
      <Screen
        name="AddWorks"
        component={WorksForm}
        options={{
          headerShown: true,
          headerTitle: "اضافة عمل جديد",
          headerTitleAlign:'center',
          headerStyle: {
            backgroundColor: "#fbb150",
            elevation: 15,
            shadowColor: "#000",
          },
        }}
      />
      <Screen
        name="EditDataSani3y"
        component={EditProfileSani3y}
        options={{
          headerShown: true,
          headerTitle: "تعديل البيانات",
          headerStyle: {
            backgroundColor: "#fbb150",
            elevation: 15,
            shadowColor: "#000",
          },
        }}
      />
      <Screen
        name="Paypal"
        component={Paypal}
        options={{
          headerShown: false,
          headerTitle: 'شراء فرص جديدة',
          headerTitleAlign:'center',
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

export default ProfileSani3yStack;
