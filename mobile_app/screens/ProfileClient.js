import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { pathUrl } from "../Config/env";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { getDataClient } from '../Redux/Slices/ClientReducer';
import Loader from "../components/Loder";
import NotFind from "../components/NotFind";
import { TextInput } from 'react-native-paper';
import { Formik } from "formik";
import * as yup from 'yup'
import ToastManager, { Toast } from "toastify-react-native";
const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function ProfileClient() {
  const [loader, setLoader] = useState(true)
  // Start Modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisiblePass, setModalVisiblePass] = useState(false);
  const navigate = useNavigation();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleModalPass = () => {
    setModalVisiblePass(!isModalVisiblePass)
  };
  // End Modal

  // Start Image in Modal
  const [image, setImage] = useState("");
  const [jopData, setJopData] = useState([]);

  const pickImage = async () => {
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
  // End Image in Modal

  // Start Fetch Data Client

  let jobs = useSelector(state => state.ClientReducer.jops)
  useEffect(() => {

    setJopData(jobs)

    // console.log(jopData.map(i => console.log(i.title)))
  }, []);
  // let [data, setData] = useState({})
  // let [jobs , setJops] = useState([])
  let [id, setId] = useState("");
  const dispatch = useDispatch()
  // Get Jobs The Client
  let data = useSelector(state => state.ClientReducer.clintdata)
  let getAllJobs = useSelector(state => state.ClientReducer.jops)
  useEffect(() => {
    setTimeout(() => {
      setLoader(false)
    }, 1100);
    AsyncStorage.getItem('id').then(result => dispatch(getDataClient(result)))
    return () => {
      setLoader(true)
    }
  }, [refreshing])

  // Dellet Job With Client
  function sendIdJob(id) {
    console.log(id)
    AsyncStorage.getItem("token").then((tok) => {
      // console.log(tok)

      axios.delete(`${pathUrl}/jobs/delete/${id}`,
        { headers: { "authorization": tok } }
      ).then((result0) => {
        // Logic  
        // console.log(result0)
        if (result0.status == 200) {
          AsyncStorage.getItem('id').then(result => dispatch(getDataClient(result))).catch((err)=> console.log(err))
        }

      })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  // Add image Client 

  function addimage() {
    const formdata = new FormData()
    formdata.append("clientImage", {
      name: image,
      type: "image/*",
      uri: image
    })
    AsyncStorage.getItem("token").then((tok) => {

      const sendImg = async () => {
        try {
          let res = await axios.post(`${pathUrl}/client/addimage`, formdata, {
            headers: {
              "Authorization": tok,
              Accept: 'application/json',
              "Content-Type": "multipart/form-data",
            }
          })
          // console.log("first")
          if (res.status == 200) {
            toggleModal()
            AsyncStorage.getItem('id').then(result => dispatch(getDataClient(result)))
          }
        } catch (error) {
          console.log(error)
        }
      }
      sendImg()
    })

  }
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
    AsyncStorage.getItem('id').then(result => dispatch(getDataClient(result)))
  }, []);

  const succesChangePass = () => {
    Toast.success("تم تغيير الباسورد بنجاح")
  }
  const [errPass, setErrPass] = useState(false)

  function confirmJob(id){
    // console.log(id)
    let body={
      "sanai3yId": id
    }
    console.log(body)
    axios.put(`${pathUrl}/client/confirmjob`,body).then(
      (res)=>{
        console.log(res)
      }
    ).catch((err) => console.log(err))
  }

  return (
    <>
      <ToastManager position="bottom" positionValue={500} />
      {!loader && <ScrollView style={{ backgroundColor: "#fff" }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >


        <View style={styles.parent}>
          <View style={styles.image}>
            <View style={styles.imgProfile}>
              <View>
                <Image
                  source={{ uri: data?.img }}
                  style={{
                    width: 200,
                    height: 200,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    resizeMode: "cover",
                  }}
                />
              </View>
              {/* Start Modal */}
              <View>
                <TouchableOpacity title="Show modal" onPress={toggleModal}>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#eee",
                      padding: 5,
                      borderBottomStartRadius: 5,
                      borderBottomEndRadius: 5,
                    }}
                  >
                    <AntDesign name="camera" style={{ fontSize: 25 }} />
                  </View>
                </TouchableOpacity>

                <Modal isVisible={isModalVisible}>
                  <TouchableOpacity
                    onPress={toggleModal}
                    style={{
                      padding: 5,
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <AntDesign
                      name="closecircleo"
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: 50,
                        fontSize: 24,
                      }}
                    />
                  </TouchableOpacity>
                  <View style={{ backgroundColor: "#eee", borderRadius: 5 }}>
                    <View
                      style={{ alignItems: "center", flexDirection: "column" }}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          width: "50%",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            paddingVertical: 2,
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
                              style={{
                                padding: 10,
                                fontSize: 14,
                                fontWeight: "bold",
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={{ width: "90%", alignItems: "center" }}>
                        {image && (
                          <Image
                            source={{ uri: image }}
                            style={{
                              width: "100%",
                              height: 200,
                              resizeMode: "cover",
                            }}
                          />
                        )}
                      </View>

                      <TouchableOpacity
                        style={[styles.button, { marginVertical: 20 }]}
                      >
                        <Text style={styles.buttonText} onPress={addimage}>إضافة</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
              {/* End Modal */}
            </View>

            <View style={styles.userName}>
              <Text
                style={{ textAlign: "center", fontSize: 25 }}
              >{`${data.firstName} ${data.lastName}`}</Text>
            </View>
          </View>

          {/* Details user */}
          <View style={styles.parentList}>
            {/* Settings */}
            <View style={styles.row}>
              {/* Change Detalis */}
              <View style={styles.col}>
                <TouchableOpacity onPress={() => navigate.navigate("editDataClient")}
                  style={{
                    backgroundColor: "#eee", padding: 5, flexDirection: "row-reverse", borderRadius: 5,
                    alignItems: "baseline",
                    paddingHorizontal: 10
                  }}>
                  <AntDesign name="setting" size={20} style={[styles.iconCol, { marginStart: 5 }]} />
                  <Text style={{ fontSize: 22 }}>تعديل البيانات</Text>
                </TouchableOpacity>
              </View>
              {/* Change Password */}
              <View style={styles.col}>
                <TouchableOpacity onPress={toggleModalPass}
                  style={{
                    backgroundColor: "#eee", padding: 5, flexDirection: "row-reverse", borderRadius: 5,
                    alignItems: "baseline",
                    paddingHorizontal: 10,
                    marginEnd: 5
                  }}>
                  <AntDesign name="lock" size={20} style={[styles.iconCol, { marginStart: 5 }]} />
                  <Text style={{ fontSize: 22 }}>تغيير كلمة السر</Text>
                </TouchableOpacity>

                <Modal isVisible={isModalVisiblePass}>
                  <TouchableOpacity onPress={toggleModalPass} style={{ padding: 5, justifyContent: "center", alignItems: "flex-start" }}>
                    <AntDesign name='closecircleo' style={{ backgroundColor: "#fff", borderRadius: 50, fontSize: 24 }} />
                  </TouchableOpacity>
                  <View style={{ backgroundColor: "#eee", borderRadius: 5 }}>
                    <View style={{ alignItems: "center", flexDirection: "column" }}>
                      <View
                        style={{
                          alignItems: "center",
                        }}
                      >
                        <Formik
                          initialValues={{
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: ""
                          }}
                          validationSchema={yup.object().shape({
                            currentPassword: yup.string().required("هذا الحقل مطلوب"),
                            newPassword: yup.string().required("هذا الحقل مطلوب").matches(/^(?=.*[0-9])(?=.*[a-z]).{8,32}$/, "يجب ان تحتوي كلمة المرور عل حرف صغير وحرف كبير وان لاتقل عن 8 أحرف"),
                            confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], "كلمة السر غير متطابقة").required("هذا الحقل مطلوب")
                          })}
                          onSubmit={(value) => {
                            let data = {
                              currentPassword: value.currentPassword,
                              newPassword: value.newPassword
                            }
                            AsyncStorage.getItem("token").then((token) => {
                              axios.put(`${pathUrl}/client/changepassword`, data, { headers: { "authorization": token } })
                                .then(res => {
                                  if (res.status == 200) {
                                    toggleModalPass()
                                    succesChangePass()
                                    setErrPass(false)
                                  }
                                }).catch(() => {
                                  setErrPass(true)
                                })
                            })
                            console.log(value)
                          }}
                        >
                          {({ handleSubmit, handleBlur, handleChange, values, touched, errors }) =>
                            <View style={{ marginTop: 20, flexDirection: "column", alignItems: "center", justifyContent: "center", width: 300 }}>
                              {errPass && <Text style={{ color: "red" }}>برجاء التاكد من كلمة السر الحالية</Text>}
                              <View style={{ width: "80%", marginBottom: 5 }}>

                                <TextInput
                                  value={values.currentPassword}
                                  onChangeText={handleChange("currentPassword")}
                                  onBlur={handleBlur("currentPassword")}

                                  placeholder="كلمة السر الحاليه"
                                  placeholderTextColor="#8b9cb5"
                                  underlineColorAndroid="#000"
                                  keyboardType='text'
                                  secureTextEntry={true}
                                  blurOnSubmit={false}
                                  style={{
                                    backgroundColor: "#eee",
                                    borderRadius: 5,
                                    color: "black"
                                  }}
                                />
                                <Text style={{ color: "red", marginTop: 5 }}>{touched.currentPassword && errors.currentPassword}</Text>
                              </View>
                              <View style={{ width: "80%", marginBottom: 5 }}>

                                <TextInput
                                  value={values.newPassword}
                                  onChangeText={handleChange("newPassword")}
                                  onBlur={handleBlur("newPassword")}
                                  placeholder="كلمة السر الجديدة"
                                  secureTextEntry={true}
                                  placeholderTextColor="#8b9cb5"
                                  style={{
                                    backgroundColor: "#eee",

                                  }}
                                />
                                <Text style={{ color: "red", marginTop: 5 }}>{touched.newPassword && errors.newPassword}</Text>
                              </View>
                              <View style={{ width: "80%", marginBottom: 5 }}>

                                <TextInput
                                  value={values.confirmPassword}
                                  onChangeText={handleChange("confirmPassword")}
                                  onBlur={handleBlur("confirmPassword")}
                                  placeholder="أعد كتابة كلمة السر"
                                  secureTextEntry={true}
                                  placeholderTextColor="#8b9cb5"
                                  style={{
                                    backgroundColor: "#eee",

                                  }}
                                />
                                <Text style={{ color: "red", marginTop: 5 }}>{touched.confirmPassword && errors.confirmPassword}</Text>
                              </View>
                              <TouchableOpacity style={[styles.button, { marginVertical: 20 }]}
                                onPress={handleSubmit}
                              >
                                <Text style={styles.buttonText}>تغيير</Text>
                              </TouchableOpacity>
                            </View>
                          }
                        </Formik>
                      </View>
                    </View>



                  </View>
                </Modal>
              </View>
              {/* End Change Password */}
            </View>
            {/* Mobile */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.textcol}>{data.phoneNumber}</Text>
              </View>
              <View style={styles.col}>
                <Entypo name="phone" style={styles.iconCol} />
              </View>
            </View>

            {/* Email */}
            <View style={styles.row}>
              <View
                style={[styles.col, { width: "60%", alignItems: "flex-start" }]}
              >
                <Text style={styles.textcol}>{data.email}</Text>
              </View>
              <View style={[styles.col, { width: "40%" }]}>
                <Entypo name="email" style={styles.iconCol} />
              </View>
            </View>

            {/* Age */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.textcol}>{`العمر : ${data.age}`}</Text>
              </View>
              <View style={styles.col}>
                <Entypo name="pencil" style={styles.iconCol} />
              </View>
            </View>
          </View>

          {/* Talbat */}
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text
              style={{
                fontSize: 25,
                borderBottomColor: "#eee",
                borderBottomWidth: 2,
              }}
            >
              المنشورات
            </Text>
          </View>

          {/* Card Style And Get All Jobs  */}
          {getAllJobs.length > 0 && getAllJobs.map((item, index) => (
            <View style={styles.card} key={index}>
              <View style={styles.cardHeader}>
                <View style={{ width: "10%" }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate.navigate("editeJobs", { idJob: item._id })
                    }
                  >
                    <Entypo name="edit" style={styles.childIcon} />
                  </TouchableOpacity>
                </View>

                <View style={{ width: "10%" }}>
                  <TouchableOpacity onPress={() => sendIdJob(item._id)}>
                    <FontAwesome name="remove" style={styles.childIcon} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.cardBody}>
                {/* jop des */}
                <View style={{ flex: 1, alignItems: "flex-start", padding: 10, width: "50%" }}>

                  <View style={{ borderLeftWidth: 1, borderLeftColor: '#ffb200' }}>
                    <Text style={[styles.text, { fontSize: 14 }]}>{item.title}</Text>
                  </View>

                  <View>
                    <Text style={[styles.text, { marginTop: 2, fontSize: 15, color: '#888' }]}> {item.city}
                    </Text>
                  </View>

                  <View style={{ paddingHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#FFF', borderTopWidth: 1, marginTop: 10, borderTopColor: '#FFF' }}>
                    <Text style={[styles.text, { marginTop: 10, color: '#555', paddingBottom: 20 }]}> {item?.description}
                    </Text>
                  </View>


                </View>
                <View style={{ width: "50%" }}>
                  <Image style={{ width: "100%", height: 100 }} source={{ uri: `${pathUrl}${item.image.slice(21)}` }} />
                </View>
              </View>

              <View style={styles.parentButton}>
                {item.status == "compelete" &&<TouchableOpacity style={[styles.button,{backgroundColor:"#fbb200"}]}
                  onPress={()=> confirmJob(item.sanai3yId) }
                >
                  <Text style={styles.buttonText}>تم الانتهاء</Text>
                </TouchableOpacity>}


                <TouchableOpacity style={[styles.button,
                {
                  backgroundColor: item.status == "in progress" ? "#555" : "#fbb200"
                }
                ]}

                >
                  <Text
                    style={styles.buttonText}
                    onPress={() =>
                      navigate.navigate("talpatSending", {
                        proposal: item,
                        status: item.status
                      })
                    }
                    // disabled={item.status == "in progress"}
                  >
                    الطلبات المقدمة
                  </Text>
                </TouchableOpacity>


              </View>

            </View>
          ))}

          {getAllJobs.length == 0 && <NotFind data={"لايوجد منشورات"} />}
        </View>
      </ScrollView>}


      {loader && <Loader />}
    </>
  );
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  // Start Secthion on style
  image: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  imgProfile: {
    marginBottom: 10,
  },
  userName: {
    justifyContent: "center",
    alignItems: "center",
  },
  // End Section one

  // Start Details Style
  parentList: {
    justifyContent: "center",
    alignItems: "center",
    // flex: 1,
    marginTop: 20,
  },
  row: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    width: "80%",
    marginVertical: 10,
  },
  col: {
    width: "50%",
    borderBottomWidth: 2,
    borderBottomColor: "#EEE",
    paddingBottom: 10,
  },
  textcol: {
    fontSize: 15,
    textAlign: "left"
  },
  iconCol: {
    fontSize: 20,
    color: "#fbb200",
  },
  // End Details Style

  // Start Card Style
  card: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    // alignItems: "center",
    width: "90%",
    backgroundColor: "#eee",
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 5,
  },
  cardHeader: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#555",
    borderBottomWidth: 1,
    elevation: 1
  },
  userDetails: {
    alignItems: "center",
    flexDirection: "row",
  },
  imageCard: {
    width: 50,
    height: 50,
    marginStart: 10,
    borderRadius: 50,
  },
  text: {
    fontSize: 16,
    marginStart: 5,
  },

  childIcon: {
    color: "#fbb200",
    textAlign: "center",
    fontSize: 25,
  },
  cardBody: {
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    // marginBottom: 20,
  },
  parentButton: {
    flex: 1,
    marginBottom: 20,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: "space-between",
    marginHorizontal: 15
  },
  // Button Style
  button: {
    // flex:1,
    // width: "50%",
    // alignItems: "center",
    // flexDirection: "c",
    justifyContent: "flex-start",
    backgroundColor: "#fbb200",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
});
