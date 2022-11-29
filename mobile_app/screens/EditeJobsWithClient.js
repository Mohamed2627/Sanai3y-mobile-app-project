import React, { useState } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { get } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDataClient } from '../Redux/Slices/ClientReducer';
import { useDispatch } from "react-redux";


export default function EditeJobsWithClient() {
  const { params } = useRoute();
  const id = get(params, "idJob");
  console.log("id",id);

  const [image, setImage] = useState(null);
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const handleUpload = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  // console.log(image);
  const worksSchema = yup.object().shape({
    title: yup.string().required("هذا الحقل مطلوب"),
    description: yup.string().required("هذا الحقل مطلوب"),
    jobImage: yup.mixed(),
  });
  const onSubmit = async (values) => {
    AsyncStorage.getItem("token").then((res) => {
      axios
        .put(`${pathUrl}/jobs/update/${id}`, values, {
          headers: { "Authorization": res },
        })
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            AsyncStorage.getItem('id').then(result => dispatch(getDataClient(result)))
            navigation.navigate("profileClient")
          }
        });
    });
  };

  return (
    <Formik
      initialValues={{ title: "", description: "", jobImage: "" }}
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
                <View style={styles.SectionStyle}>
                  <TextInput
                    style={styles.inputStyle}
                    onChangeText={handleChange("title")}
                    value={values.title}
                    placeholder="ادخل عنوان المشكلة (ادخل وصف مختصر يعبر عن المشكلة)" //Text
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
                    style={styles.textAreaStyle}
                    placeholder="ادخل وصف المشكلة" //12345
                    placeholderTextColor="#8b9cb5"
                    keyboardType="default"
                    value={values.description}
                    onChangeText={handleChange("description")}
                    onSubmitEditing={Keyboard.dismiss}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    multiline={true}
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
                ></View>
                {touched.jobImage && errors.jobImage && (
                  <Text style={styles.errorTextStyle}>{errors.jobImage}</Text>
                )}
                <TouchableOpacity
                  style={styles.buttonStyle}
                  activeOpacity={0.5}
                  onPress={handleSubmit}
                >
                  <Text style={styles.buttonTextStyle}>تعديل</Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </View>
          </ScrollView>
        </View>
      )}
    </Formik>
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
  buttonTextStyle: {
    color: "white",
    fontSize: 18,
  },
  inputStyle: {
    flex: 1,
    color: "#000",
    paddingLeft: 6,
    paddingRight: 15,
    paddingVertical:10,
    alignItems:"center",
    justifyContent:"center",
    paddingTop: 5,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#dadae8",
    textAlign: "right",
    elevation: 2,
  },
  textAreaStyle:{
    flex: 1,
    color: "#000",
    padding:10,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#dadae8",
    textAlign: "right",
    textAlignVertical: "top",
    elevation: 2,
    height:100
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
});
