import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
// import * as ImagePicker from "react-native-image-picker"
import * as ImagePicker from "expo-image-picker";
import { pathUrl } from "../Config/env";
import * as yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./Login";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { StackActions } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import ToastManager, { Toast } from 'toastify-react-native'
import { MaterialIcons } from "@expo/vector-icons";

export default function WorksForm() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [token, setToken] = useState('')
  const dispatch = useDispatch()
  const handleUpload = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  // console.log(image);
  const worksSchema = yup.object().shape({
    title: yup.string().required("هذا الحقل مطلوب"),
    description: yup.string().required("هذا الحقل مطلوب"),
    // img: yup.mixed(),
  });
  useEffect(() => {
    AsyncStorage.getItem('token').then((res) => setToken(res))

  }, [])
  const onSubmit = async (values) => {
    const formData = new FormData()
    formData.append("title", values.title)
    formData.append("description", values.description)
    formData.append("workImage", {
      name: image,
      uri: image,
      type: "image/*"
    })

    axios.post(`${pathUrl}/sanai3y/addwork`, formData,
      {
        headers: {
          "authorization": token,
          Accept: 'application/json',
          "Content-Type": "multipart/form-data",
        }
      }).then((res) => {
        // console.log(res);
        if (res.status == 200) {
          // console.log("true");
          showToasts()
          setTimeout(() => {
            navigation.navigate('ShowWorks')
            AsyncStorage.getItem('id').then(result => dispatch(getDataSnai3y(result)))
            
          }, 3000);
        } else {
          // console.log("erorr");
          // console.log("Please check your email id or password");
        }
      }).catch((err) => {
        // console.log("erorr");
        console.log(err);
      });
      
  };
  const showToasts = () => {
    Toast.success('تم الأضافة بنجاح')
  }
  return (
    <>
    <ToastManager/>
      <Formik
        initialValues={
          {
            title: "",
            description: "",
            workImage: ""
          }
        }
        validationSchema={worksSchema}
        onSubmit={onSubmit}
      >
        {({
          handleSubmit,
          handleChange,
          errors,
          touched,
          values,
          setFieldTouched,
        }) => (
          <View style={styles.mainBody}>
            {/* <Loader loading={loading} /> */}
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                flex: 1,
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <View>
                <KeyboardAvoidingView enabled>
                  <Text
                    style={{
                      color: "#000",
                      fontSize: 25,
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
                    اضافة عمل جديد
                  </Text>
                  <View style={styles.SectionStyle}>
                    <TextInput
                      style={styles.inputStyle}
                      onChangeText={handleChange("title")}
                      value={values.title}
                      placeholder="ادخل عنوان العمل" //Text
                      placeholderTextColor="#8b9cb5"
                      autoCapitalize="none"
                      keyboardType="default"
                      returnKeyType="next"
                      blurOnSubmit={false}
                      onBlur={() => setFieldTouched("title")}
                    />
                  </View>
                  {touched.title && errors.title && (
                    <Text style={styles.errorTextStyle}>{errors.title}</Text>
                  )}
                  <View style={styles.SectionStyle}>
                    <TextInput
                      style={[styles.inputStyle, styles.description]}
                      placeholder="ادخل وصف العمل" //12345
                      placeholderTextColor="#8b9cb5"
                      keyboardType="default"
                  multiline={true}
                      value={values.description}
                      onChangeText={handleChange("description")}
                      onSubmitEditing={Keyboard.dismiss}
                      blurOnSubmit={false}
                      returnKeyType="next"
                      onBlur={() => setFieldTouched("description")}
                    />
                  </View>
                  {touched.description && errors.description && (
                    <Text style={styles.errorTextStyle}>
                      {errors.description}
                    </Text>
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <TouchableOpacity
                      style={styles.buttonPhoto}
                      activeOpacity={0.5}
                      onPress={handleUpload}
                    >
                      <Text style={[styles.buttonTextStyle, { color: "black", paddingHorizontal:10 }]}>
                      <MaterialIcons name="add-photo-alternate" style={styles.styleUser} /> 
                     <Text> اضف صورة</Text>   
                      </Text>
                    </TouchableOpacity>
                    {image && (
                      <Image
                        source={{ uri: image }}
                        style={{ height: 200, width: 200, margin: 10 }}
                      />
                    )}
                  </View>
                  {touched.jobImage && errors.jobImage && (
                    <Text style={styles.errorTextStyle}>{errors.jobImage}</Text>
                  )}
                  <TouchableOpacity
                    style={styles.buttonStyle}
                    activeOpacity={0.5}
                    onPress={handleSubmit}

                  >
                    <Text style={styles.buttonTextStyle} >
                      <MaterialIcons name="post-add" style={{color:'#fff', fontSize:20}}></MaterialIcons>
                     <Text> اضافة العمل</Text> 
                      </Text>
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              </View>
            </ScrollView>
          </View>
        )}
      </Formik>
    </>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    alignContent: "center",
  },
  SectionStyle: {
    flexDirection: "row",
    // height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: "#ffb200",
    borderWidth: 0,
    color: "#FFFFFF",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginLeft: 100,
    marginRight: 100,
    marginTop: 20,
    marginBottom: 25,
    elevation: 5,
  },
  description: {
    height: 100,
  },
  buttonTextStyle: {
    color: "white",
    fontSize: 19,
  },
  buttonPhoto: {
    backgroundColor: "white",
    borderWidth: 0,
    height: 55,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5,
    padding: 5,

    marginTop: 20,
    marginBottom: 20,
    elevation: 5,
  },
  inputStyle: {
    flex: 1,
    color: "#000",
    paddingLeft: 6,
    paddingRight: 15,
    paddingTop: 5,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#8b9cb5",
    textAlign: "right",
    textAlignVertical: "top",
    elevation: 2,
    height:40
  },
  styleUser: {
    fontSize: 22,

    color: "#ffb200",

    // padding: 9,
    // paddingTop: 15,
  },

  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
});
