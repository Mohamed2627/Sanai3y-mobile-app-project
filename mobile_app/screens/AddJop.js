import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import * as yup from 'yup';
import axios from 'axios';

import { Formik } from "formik";
import SelectDropdown from "react-native-select-dropdown";
import { Button } from "react-native-paper";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { pathUrl } from "../Config/env";
import { useNavigation } from "@react-navigation/native";
import { getDataJops } from "../Redux/Slices/JobsReducer";
import { useDispatch } from "react-redux";
// import { launchImageLibrary,  } from "react-native-image-picker";
import Loader from "../components/Loder";

const AddJop = () => {
  let [regErr, setRegErr] = useState(false);
  const [image, setImage] = useState("");
  const [tok, setTok] = useState('')
  const [ loader ,setLoader]= useState(true)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  useEffect(() => {
    AsyncStorage.getItem('token').then((res) => setTok(res))
    
    
    setTimeout(() => {
      setLoader(false)
    }, 1100);
    return () => {
      // console.log("dispathJop*********")
      dispatch(getDataJops())
    }
  }, [])
  

  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 1
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  // console.log(image)
  // Data for Address
  let dataAddress = [
    { value: "أسوان" },
    { value: "أسوان الجديدة" },
    { value: "دراو" },
    { value: "كوم امبو" },
    { value: "نصر النوبة" },
    { value: "كلابشة" },
    { value: "أدفو" },
  ];

  let dataSkills = [
    { value: "نجار" },
    { value: "سباك" },
    { value: "مبيض محارة" },
    { value: "كهربائي" },
    { value: "فني تكييف" },
    { value: "دهانات" },
    { value: "بناء" },
    { value: "الوميتال" },
    { value: "فني ارضيات" },
  ];
  return (
    <>
      {!loader&&<Formik
        initialValues={{
          titleJob: "",
          address: "",
          skills: "",
          detailsAboutJob: "",
          addresJob: "",
          imageTest: ""
        }}
        validationSchema={yup.object().shape({
          titleJob: yup.string().required("هذا الحقل مطلوب").trim(),
          address: yup.string().required("هذا الحقل مطلوب").trim(),
          skills: yup.string().required("هذا الحقل مطلوب").trim(),
          detailsAboutJob: yup.string().required("هذا الحقل مطلوب").trim(),
          addresJob: yup.string().required("هذا الحقل مطلوب").trim(),



        })}
        onSubmit={(values) => {
          const formData = new FormData()
          formData.append("title", values.titleJob)
          formData.append("city", values.address)
          formData.append("category", values.skills)
          formData.append("description", values.detailsAboutJob)
          formData.append("address", values.addresJob)
          formData.append("jobImage", {
            name: image,
            type: "image/*",
            uri: image
          })
          
          const regUser = async () => {
            try {
              const res = await axios.post(`${pathUrl}/jobs/postjob`, formData,
                {
                  headers:
                  {
                    "authorization": tok,
                    Accept: 'application/json',
                    "Content-Type": "multipart/form-data",
                  }
                }
              )


              console.log('y')
              if (res.status == 200) {
                console.log(res.status);
                // setRegErr(true);
                
                navigation.navigate('HomeScreen')
              }
            } catch (err) {
              // setRegErr(true);
              console.log(err)

            }
          };

          regUser();

        }}
      >
        {({
          handleSubmit,
          handleBlur,
          handleChange,
          errors,
          touched,
          isValid,
          values,
        }) => (
          <ScrollView style={{ backgroundColor: "#FFF", flex: 1 }}>
            {/* One */}
            <View style={[styles.SectionStyle, { marginTop: 70 }]}>
              <View style={{ flex: 1, height: 80 }}>
                <TextInput
                  style={styles.inputStyle}
                  // underlineColorAndroid="#f000"
                  placeholderTextColor="#8b9cb5"
                  placeholder={" عنوان الوظيفة - مثال ( مشكلة بالتكيف )"}
                  // autoCapitalize="sentences"
                  // returnKeyType="next"
                  // keyboardType="text"
                  value={values.titleJob}
                  onChangeText={handleChange('titleJob')}
                  onBlur={handleBlur('titleJob')}
                />
                <Text style={[styles.errorTextStyle, { paddingVertical: 5 }]}>{touched.titleJob && errors.titleJob}</Text>
              </View>
            </View>

            {/* Input Address Jobs And Type Jobs */}
            <View style={[styles.SectionStyle, { marginTop: 40 }]}>
              <View style={{ flex: 1, height: 80, width: "100%" }}>
                <SelectDropdown
                  data={dataAddress}
                  defaultButtonText="أختر المركز"
                  buttonStyle={styles.selectInputStyle}
                  buttonTextStyle={{ textAlign: 'justify', color: "#8b9cb5" }}
                  buttonTextAfterSelection={(selecteditem, index) => {
                    return selecteditem.value;
                  }}
                  rowTextForSelection={(item) => {
                    return item.value;
                  }}
                  renderDropdownIcon={() => {
                    return <AntDesign name="caretdown" />;
                  }}
                  // onSelect={}
                  onSelect={(item) => (values.address = item.value)}
                // onBlur={handleBlur('address')}
                />
                <Text style={[styles.errorTextStyle, { paddingVertical: 5 }]}>{errors.address}</Text>
              </View>
            </View>

            <View style={[styles.SectionStyle, { marginTop: 40 }]}>
              <View style={{ flex: 1, height: 80 }}>
                <SelectDropdown
                  data={dataSkills}
                  defaultButtonText="أختر الحرفة"
                  buttonStyle={styles.selectInputStyle}
                  buttonTextStyle={{ textAlign: 'justify', color: "#8b9cb5" }}
                  buttonTextAfterSelection={(selecteditem, index) => {
                    return selecteditem.value;
                  }}
                  rowTextForSelection={(item) => {
                    return item.value;
                  }}
                  renderDropdownIcon={() => {
                    return <AntDesign name="caretdown" />;
                  }}
                  // onSelect={}
                  onSelect={(item) => (values.skills = item.value)}
                // onBlur={handleBlur('address')}
                />
                <Text style={[styles.errorTextStyle, { paddingVertical: 5 }]}>{errors.skills}</Text>
              </View>
            </View>

            {/* Three */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <TextInput
                multiline={true}
                numberOfLines={2}
                placeholderTextColor="#8b9cb5"
                placeholder={
                  "اشرح المشكله اللتي تواجهك - مثال ( عدم خروج هواء بارد )"
                }
                value={values.detailsAboutJob}
                onChangeText={handleChange('detailsAboutJob')}
                onBlur={handleBlur('detailsAboutJob')}
                style={{
                  padding: 10,
                  height: 100,
                  width: "85%",
                  textAlignVertical: "top",
                  backgroundColor: "#FFF",
                  elevation: 2,
                  borderRadius: 2,
                  marginTop: 40,
                  borderWidth: 1,
                  borderColor: "#eee",

                }}
              />
              <Text style={[styles.errorTextStyle, { paddingTop: 5 }]}>{touched.detailsAboutJob && errors.detailsAboutJob}</Text>
            </View>

            <View
              style={[styles.SectionStyle, { marginBottom: 20 }]}
            >
              <View style={{ flex: 1, height: 80 }}>
                <TextInput
                  style={styles.inputStyle}
                  // underlineColorAndroid="#f000"
                  placeholder=" اكتب عنوانك بالتفصيل - مثال ( بجوار مسجد التوحيد )"
                  placeholderTextColor="#8b9cb5"
                  // autoCapitalize="sentences"
                  // returnKeyType="next"
                  // blurOnSubmit={false}
                  // keyboardType="text"
                  value={values.addresJob}
                  onChangeText={handleChange('addresJob')}
                  onBlur={handleBlur('addresJob')}
                />
                <Text style={[styles.errorTextStyle, { paddingVertical: 5 }]}>{touched.addresJob && errors.addresJob}</Text>
              </View>
            </View>

            {/* Test Images */}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 1,
                paddingBottom: 10,
                borderBottomColor: "#EEE",
                marginTop: 10
              }}
            >
              <View
                style={{
                  // flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  // alignContent:'space-between',
                  width: "50%",
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingVertical: 5,
                    marginTop: 10,
                    alignItems: "center",
                    borderRadius: 10,
                    marginBottom: 40,
                    flexDirection: "row",
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "#999",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#000",
                        fontSize: 15,
                        padding: 6,
                      }}
                      onPress={pickImage}

                    >
                      اضافة صورة
                    </Text>
                  </View>
                  <View>
                    <AntDesign
                      name="download"
                      style={{ padding: 10, fontSize: 14, fontWeight: "bold" }}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ width: "50%" }}>
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 170, height: 100 }}
                  // value={values.image}
                  />
                )}
              </View>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                  marginTop: 10,
                  alignItems: "center",
                  borderRadius: 10,
                  marginBottom: 40,
                  flexDirection: "row",
                  backgroundColor: "#ffb200",
                  justifyContent: "center",
                }}
                onPress={handleSubmit}
              >
                <View>
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#000",
                      fontSize: 15,
                      padding: 6,
                    }}

                  >
                    مشاركة المشكلة
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </Formik>}

      {loader&&<Loader/>}
    </>
  );
};

export default AddJop;

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 10,
    marginLeft: 35,
    marginRight: 35,
    // margin: 10,
  },
  buttonStyle: {
    backgroundColor: "#ffb200",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 5,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
    width: 90,
    justifyContent: "center",
    elevation: 5,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 18,
  },

  selectInputStyle: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingHorizontal: 100,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#dadae8",
    backgroundColor: "#fff",
    width: "100%",
    elevation: 2,
  },
  inputStyle: {
    // flex: 1,
    height: 50,
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    paddingHorizontal: 100,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#dadae8",
    backgroundColor: "#fff",
    elevation: 2,
  },
  errorTextStyle: {
    color: "red",
    paddingRight: 5,
    fontSize: 12,
  },
  successTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    padding: 30,
  },
});
