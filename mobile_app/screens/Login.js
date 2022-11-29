// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, createRef, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
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
} from 'react-native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup'
import { Formik } from 'formik'
import { pathUrl } from '../Config/env';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import Loader from '../components/Loder';
import { useDispatch } from 'react-redux';
// import Loader from './Components/Loader';
import ToastManager, { Toast } from 'toastify-react-native'
const LoginScreen = () => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(true);
  const [logErr, setLogErr] = useState(false)
  const dispatch = useDispatch()
  const loginSchema = yup.object().shape({
    email: yup.string().email("البريد الإلكتروني غير صحيح").required("هذا الحقل مطلوب"),
    password: yup.string().required("هذا الحقل مطلوب"),
  })
  // Local Storage
  useEffect(() => {
    setTimeout(() => {
      setLoader(false)
    }, 1100);

    return () => {
      AsyncStorage.getItem('snai3yRole').then(res => {
        if (res == "client") {
          // console.log("client dispatch");
          return AsyncStorage.getItem('id').then(result => dispatch(getDataClient(result)))
        }
        else if (res == "sanai3y") {
          // console.log("sni3y dispatch");
          return AsyncStorage.getItem('id').then(result => dispatch(getDataSnai3y(result)))
        }
        else {
          return false
        }
      }

      )
      setLoader(true)
    }
  }, [])


  const onSubmit = async (values) => {
    // setLoading(true);
    const sendLogin = async () => {
      // console.log(values)
      console.log(values)
      try {
        let res = await axios.post(`${pathUrl}/client/signin`, values)
        // console.log(res);
        if (res.data.message == "Valid password & logged in") {
          const stor = async () => {
            await AsyncStorage.setItem("token", res.headers.authorization);
            await AsyncStorage.setItem("snai3yRole", res.data.data.rule);
            await AsyncStorage.setItem("id", res.data.data._id);
            // console.log("true");
          }
          stor()
          // console.log(res)
          navigation.navigate('Home')

        } else {
          setLogErr(true)
        }

      } catch (err) {
        console.log(err)
        showToasts()
      }
    }

    sendLogin()
  };
  const showToasts = () => {
    Toast.error("لبريد الالكتروني أو كلمة السر غير صحيحه")
  }

  return (
    <>
      {!loader &&
          <Formik
            initialValues={{ email: '', password: '' }}
            // onSubmit={login}
            validationSchema={loginSchema}
            onSubmit={onSubmit}
          >
            {({ handleSubmit, handleChange, errors, touched, values, setFieldTouched }) => (
              <View style={styles.mainBody}>
                <ToastManager/>
                {/* <Loader loading={loading} /> */}
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{
                    // flex: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                    marginTop:150
                  }}>
                  <View>
                    <View style={{ alignItems: 'center', justifyContent: "flex-end", height: 200 }}>
                      <Image
                        source={require('../assets/logo.png')}
                        style={{
                          width: '50%',
                          height: "100%",
                          resizeMode: 'contain',
                          margin: 30,
                        }}
                      />

                    </View>
                    {/* {logErr && <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "center", marginBottom: 10 }}>
                      <View style={{ backgroundColor: "#dc2626", padding: 5, borderRadius: 5, width: "80%" }}>
                        <Text style={{ color: "#fff", fontSize: 18, textAlign: "center" }}>البريد الألكتروني أو كلمة السر غير صحيحه</Text>
                      </View>
                    </View>} */}
                    <KeyboardAvoidingView enabled>
                      <Text style={{
                        color: "#000",
                        fontSize: 25,
                        fontWeight: "700",

                        textAlign: 'center'
                      }}

                      >تسجيل الدخول</Text>

                      {/* <Entypo name='login' style={{
                      color: "#000",
                      fontSize: 30,
                      fontWeight: "700",
                      textAlign: 'center'
                    }}/> */}
                      <View style={styles.SectionStyle}>
                        <Icon name='user' style={styles.styleUser} />

                        <TextInput
                          style={styles.inputStyle}
                          onChangeText={handleChange('email')}
                          value={values.email}
                          placeholder="ادخل البريد الالكتروني" //dummy@abc.com
                          placeholderTextColor="#8b9cb5"
                          autoCapitalize="none"
                          keyboardType="email-address"
                          returnKeyType="next"
                          blurOnSubmit={false}
                          onBlur={() => setFieldTouched('email')}
                        />
                      </View>
                      {touched.email && errors.email && (
                        <Text style={styles.errorTextStyle}>
                          {errors.email}
                        </Text>
                      )}
                      <View style={styles.SectionStyle}>
                        <Icon name='lock' style={styles.styleUser} />
                        <TextInput
                          style={styles.inputStyle}
                          placeholder="ادخل كلمة السر" //12345
                          placeholderTextColor="#8b9cb5"
                          keyboardType="default"
                          value={values.password}
                          onChangeText={handleChange('password')}
                          onSubmitEditing={Keyboard.dismiss}
                          blurOnSubmit={false}
                          secureTextEntry={true}
                          returnKeyType="next"
                          onBlur={() => setFieldTouched('password')}
                        />
                      </View>
                      {touched.password && errors.password && (
                        <Text style={styles.errorTextStyle}>
                          {errors.password}
                        </Text>
                      )}
                      <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={handleSubmit}>
                        <Text style={styles.buttonTextStyle}>تسجيل الدخول</Text>
                      </TouchableOpacity>
                      <Text
                        style={styles.registerTextStyle}
                        onPress={() => navigation.navigate("register")}>
                        <Text
                          style={{ color: "#000" }}
                        > ليس لديك حساب؟  </Text>
                        التسجيل
                      </Text>
                    </KeyboardAvoidingView>
                  </View>

                </ScrollView>
              </View>
            )}

          </Formik>
      }


      {loader && <Loader />}
    </>

  );
};
export default LoginScreen;

const styles = StyleSheet.create({

  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#ffb200',
    borderWidth: 0,
    color: '#FFFFFF',
    // borderColor: '#000',
    height: 45,
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
    elevation: 5,
  },
  buttonTextStyle: {
    color: 'white',
    paddingVertical: 10,
    fontSize: 20,
  },
  inputStyle: {
    flex: 1,
    color: '#000',
    paddingLeft: 35,
    paddingRight: 15,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: '#dadae8',
    textAlign: 'right',
    elevation: 2,

  },
  registerTextStyle: {
    color: 'blue',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  styleUser: {
    position: "absolute",
    fontSize: 24,
    zIndex: 99,
    color: "#ffb200",

    padding: 5,
    paddingTop: 9,
    paddingEnd: 10
  },
});
