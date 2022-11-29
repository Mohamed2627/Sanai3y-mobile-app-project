import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Button, Platform, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { pathUrl } from '../Config/env';
import NotFind from '../components/NotFind';
import { result } from 'lodash';
import { getDataSnai3y } from '../Redux/Slices/Snai3yReducer';
import Loader from '../components/Loder';
import { Formik } from 'formik';
import { TextInput } from 'react-native-paper';
import * as yup from 'yup'
import ToastManager, { Toast } from 'toastify-react-native';
const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function ProfileSnai3y() {
  const [loader, setLoader] = useState(false)
  // Start Modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisiblePass, setModalVisiblePass] = useState(false);
  const navigation = useNavigation()
  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  };
  const toggleModalPass = () => {
    setModalVisiblePass(!isModalVisiblePass)
  };
  // End Modal

  // Start Image in Modal
  const [image, setImage] = useState("");
  const [photo, setPhoto] = useState({});

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
  // console.log(image)
  // End Image in Modal

  // Data Sani3y

  const [snai3yJobs, setSnai3yJobs] = useState([])
  const dispatch = useDispatch()
  const datas = useSelector(state => state.Snai3yReducer.dataSani3y)
  // console.log(datas);
  useEffect(() => {
    AsyncStorage.getItem('token').then((res) => {

      axios.get(`${pathUrl}/sanai3y/jobs`, { headers: { "Authorization": res } }).then((result) => {
        // console.log("ggg")
        if (result.status == 200) {
          // console.log("jobs",result.data.Data)
          setSnai3yJobs(result.data.Data)
          setTimeout(() => {
            setLoader(false)

          }, 100);
        }
      })
    })
    AsyncStorage.getItem('id').then(result => dispatch(getDataSnai3y(result)))
    return () => {
      setLoader(true)
    }
  }, [])
  function sendImg() {
    AsyncStorage.getItem('token').then((token) => {
      // console.log("first")
      const send = async () => {
        try {
          const formdata = new FormData()
          formdata.append("sanai3yImage", {
            name: image,
            type: "image/*",
            uri: image
          })
          // console.log(image)
          const res = await axios.post(`${pathUrl}/sanai3y/addimage`, formdata, {
            headers: {
              "Authorization": token,
              Accept: 'application/json',
              "Content-Type": "multipart/form-data",
            }
          })
          if (res.status == 200) {
            toggleModal()
            AsyncStorage.getItem('id').then(result => dispatch(getDataSnai3y(result)))
          }
        } catch (error) {
          console.log(error)
        }
      }
      send()

    })
  }
  // Refresh
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
    AsyncStorage.getItem('id').then(result => dispatch(getDataSnai3y(result)))
    AsyncStorage.getItem('token').then((res) => {

      axios.get(`${pathUrl}/sanai3y/jobs`, { headers: { "Authorization": res } }).then((result) => {
        // console.log("ggg")
        if (result.status == 200) {
          // console.log("jobs",result.data.Data)
          setSnai3yJobs(result.data.Data)
          setTimeout(() => {
            setLoader(false)

          }, 100);
        }
      })
    })
  }, []);

// Tost Change Pass
const tostChangePass=()=>{
  Toast.success("تم تغيير كلمة السر بنجاح")
}
const [errPass , setErrPass]=useState(false)
// Tost complet Job
const tostComplite=()=>{
  Toast.success("تهانينا تم الانتهاء من الوظيفة")
}
const tostErr= () =>{
  Toast.error("حدث خطأ برجاء المحاولة مرة أخري")
}  // complet Job
  function completeJob(){
    AsyncStorage.getItem("token").then((token)=>{
      axios.put(`${pathUrl}/sanai3y/jobcompelete`,{},{headers:{"authorization": token}})
      .then((res)=>{
        // console.log(token)
        if (res.status == 200){
          tostComplite()
          // console.log("succes")
          // AsyncStorage.getItem('id').then(result => dispatch(getDataSnai3y(result)))
        }
      }).catch((err)=>{
        tostErr()
        console.log(err)
      })  

    })
  }

  function checkOut() {

   navigation.navigate("Paypal")
  }


  return (
    <>
      <ToastManager position="bottom" positionValue={500}/>
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
                <Image source={{ uri: datas?.img }}
                  style={{ width: 200, height: 200, borderTopLeftRadius: 5, borderTopRightRadius: 5, resizeMode: "cover" }}
                />
              </View>
              {/* Start Modal */}
              <View>
                <TouchableOpacity onPress={toggleModal} >
                  <View style={{
                    justifyContent: "center", alignItems: "center", backgroundColor: "#eee",
                    padding: 5, borderBottomStartRadius: 5, borderBottomEndRadius: 5
                  }}>

                    <AntDesign name='camera' style={{ fontSize: 25 }} />
                  </View>
                </TouchableOpacity>

                <Modal isVisible={isModalVisible}>
                  <TouchableOpacity onPress={toggleModal} style={{ padding: 5, justifyContent: "center", alignItems: "flex-start" }}>
                    <AntDesign name='closecircleo' style={{ backgroundColor: "#fff", borderRadius: 50, fontSize: 24 }} />
                  </TouchableOpacity>
                  <View style={{ backgroundColor: "#eee", borderRadius: 5 }}>
                    <View style={{ alignItems: "center", flexDirection: "column" }}>
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
                            borderColor: '#999'
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
                      <View style={{ width: "90%", alignItems: "center" }}>
                        {image && (
                          <Image
                            source={{ uri: image }}
                            style={{ width: "100%", height: 200, resizeMode: "cover" }}
                          />
                        )}
                      </View>

                      <TouchableOpacity style={[styles.button, { marginVertical: 20 }]}
                        onPress={sendImg}
                      >
                        <Text style={styles.buttonText}>إرسال</Text>
                      </TouchableOpacity>
                    </View>


                  </View>
                </Modal>
              </View>
              {/* End Modal */}


            </View>
            <View style={styles.userName}>

              <Text style={{ textAlign: "center", fontSize: 25 }}>{`${datas.firstName} ${datas.lastName}`}</Text>
            </View>
          </View>

          {/* Details user */}
          <View style={styles.parentList}>
            <View style={styles.row}>
              {/* Change Detalis */}
              <View style={styles.col}>
                <TouchableOpacity onPress={() => navigation.navigate("EditDataSani3y")}
                  style={{
                    backgroundColor: "#eee", padding: 5, flexDirection: "row-reverse", borderRadius: 5,
                    alignItems: "baseline",
                    paddingHorizontal: 10
                  }}>
                  <AntDesign name="setting" size={20} style={[styles.iconCol, { marginStart: 5 }]} />
                  <Text style={{ fontSize: 18, color:'#666' }}>تعديل البيانات</Text>
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
                  <Text style={{ fontSize: 18, color:'#666'  }}>تغيير كلمة السر</Text>
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
                            newPassword: yup.string().required("هذا الحقل مطلوب").matches(/^(?=.*[0-9])(?=.*[a-z]).{8,32}$/,"يجب ان تحتوي كلمة المرور عل حرف صغير وحرف كبير وان لاتقل عن 8 أحرف"),
                            confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], "كلمة السر غير متطابقة").required("هذا الحقل مطلوب")
                          })}
                          onSubmit={(value) => {
                            let data= {
                              currentPassword: value.currentPassword,
                              newPassword: value.newPassword
                            }
                            AsyncStorage.getItem("token").then((token)=>{
                              axios.put(`${pathUrl}/sanai3y/changepassword`,data,{headers:{"authorization":token}})
                              .then((res)=>{
                                if(res.status == 200){
                                  tostChangePass()
                                  setErrPass(false)
                                  toggleModalPass()
                                }
                              }).catch(err=>{
                                setErrPass(true)
                                console.log(err)
                              })
                            })
                            // console.log(value)
                          }}
                        >
                          {({ handleSubmit, handleBlur, handleChange, values, touched, errors }) =>
                            <View style={{ marginTop: 20, flexDirection: "column", alignItems: "center", justifyContent: "center", width: 300 }}>
                              {errPass&&<Text style={{color:"red"}}>برجاء التأكد من كلمة السر الحالية</Text>}
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
                                    backgroundColor: "#eee"
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


            {/* paypal  */}
            <View style={styles.row}>
              <TouchableOpacity onPress={()=> checkOut()}
              style={{
                backgroundColor:"#eee", padding:5,flexDirection:"row-reverse",borderRadius:5,
                alignItems:"baseline",
                paddingHorizontal:10
                }}>
                <Entypo name="paypal" size={20} style={[styles.iconCol,{marginStart:5}]}/>
                <Text style={{fontSize:18, color:'#666' }}>الدفع</Text>
              </TouchableOpacity>
            </View>



            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.textcol}>{datas.phoneNumber}</Text>
              </View>
              <View style={styles.col}>
                <Entypo name='phone' style={styles.iconCol} />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.col, { width: "80%" }]}>
                <Text style={styles.textcol}>{datas.email}</Text>
              </View>
              <View style={[styles.col, { width: "20%" }]}>
                <Entypo name='email' style={styles.iconCol} />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.textcol}>العمر :  ({datas.age})</Text>
              </View>
              <View style={styles.col}>
                <Entypo name='pencil' style={styles.iconCol} />
              </View>
            </View>
              {/* Skills */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.textcol}>{datas.skills}</Text>
              </View>
              <View style={styles.col}>
                <Entypo name='tools' style={styles.iconCol} />
              </View>
            </View>
            {/* Jop Count */}
            <View style={styles.row}>
              <View style={[styles.col,{width:"80%"}]}>
                <Text style={styles.textcol}>{`عدد الوظائف المتاحة :  (${datas?.jobcount})`}</Text>
              </View>
              <View style={[styles.col,{width:"20%"}]}>
                {datas.jobcount > 0 && <AntDesign name='like2' style={styles.iconCol} />}
                {datas.jobcount ==0 &&<AntDesign name='dislike2' style={styles.iconCol} />}
              </View>
            </View>

            <View style={styles.row}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ShowWorks')}>
                <Text style={styles.buttonText}>
                  <FontAwesome name="window-restore" style={{fontSize:20}}></FontAwesome>   
            <Text style={{paddingLeft:20}}> معرض الأعمال</Text>      
                  </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Talbat */}
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ fontSize: 22, borderBottomColor: "#eee", borderBottomWidth: 2 }}>الطلبات المؤكدة</Text>
          </View>

          {/* Card Style */}
          {snai3yJobs.map((item,index) =>
            <View style={{ flex: 1, justifyContent: "center" }} key={index}>
              {snai3yJobs.length > 0 && 
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ width: "100%" }}>
                    <View style={styles.userDetails}>
                      <Image source={{ uri: `${pathUrl}${item?.clientData?.img?.slice(21)}` }}
                        style={[styles.imageCard, { resizeMode: "contain" }]}
                      />
                      <View>
                        <Text style={[styles.text, { borderEndWidth: 10, borderStyle: "solid", borderEndColor: "red" }]}>
                          {`${item.clientData?.firstName} ${item.clientData?.lastName}`}
                        </Text>
                        <Text style={[styles.text, { fontSize: 12, color:'#555' }]}>
                          {item.clientData?.address}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.cardBody}>
                  {/* jop des */}
                  <View style={{  alignItems: "flex-start", padding: 10, backgroundColor:'#FFF' }}>
                    <View>
                      <Text style={[styles.text, {fontSize:15,fontWeight:'bold'}]}>
                        وصف سريع  : 
                       <Text style={{fontWeight:'normal'}}> {item?.title}</Text> 
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.text, { marginTop: 5, fontSize:14,fontWeight:'bold', borderBottomWidth:1, paddingBottom:10, borderBottomColor:'#EEE' }]}>
                        التفاصيل :
                        <Text style={{fontWeight:'normal'}}> {item?.description}</Text>
                        </Text>
                    </View>
                  </View>
                  {/* img Jop */}
                  <View style={{ backgroundColor:'#FFF', paddingBottom:10,paddingTop:10 }}>
                    <Image source={{ uri: `${pathUrl}${item?.image?.slice(21)}` }}
                      style={{ height: 200, resizeMode: "contain" }} />
                  </View>
                </View>
                <View style={styles.cardTalp}>
                  <View style={styles.headerTalp}>
                    <Text style={styles.textHeaderTalp}>
                      <AntDesign name='message1' ></AntDesign>
                     <Text style={{marginRight:5}}> طلبك المقدم </Text> 
                      </Text>
                  </View>
                  {item.proposals.map((p, index) =>

                    <View key={index}>
                      <Text style={styles.textTalp}>
                        {p?.sanai3yProposal}
                      </Text>
                    </View>
                  )}
                </View>

                <View 
                style={{justifyContent:"center",flex:1,alignItems:"flex-end"}}>
                  <TouchableOpacity onPress={completeJob} disabled={item.status == "compelete"}
                  style={[styles.button , 
                  {marginEnd:10,marginBottom:20,marginTop:10,
                    backgroundColor: item.status == "compelete"? "#555":"#fbb200"
                  }]}>
                    <Text style={[styles.buttonText, {fontSize:18}]}>
                <Text>تم الانتهاء </Text> 
                <AntDesign name='lock' style={{fontSize:18}}></AntDesign>
                       </Text>
                  </TouchableOpacity>
                </View>
              </View>}
            </View>
          )}
          {snai3yJobs.length == 0 && <NotFind data={"لاتوجد طلبات مؤكدة"} />}

        </View>
      </ScrollView >}


      {loader && <Loader />}
    </>

  )
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  // Start Secthion on style
  image: {
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
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
    marginTop: 20
  },
  row: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    width: "80%",
    marginVertical: 10
  },
  col: {
    width: "50%",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 10,
  },
  textcol: {
    fontSize: 15,
    textAlign: "left"
  },
  iconCol: {
    fontSize: 20,
    color: "#fbb200"
  },
  // End Details Style

  // Button Style
  button: {
    backgroundColor: "#fbb200",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 25,
    color: "#fff"
  },
  // Start Card Style
  card: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    // alignItems: "center",
    width: "90%",
    backgroundColor: "#eee",
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 5,
    elevation: 5
  },
  cardHeader: {
    backgroundColor: "#FFF", //test
    borderRadius: 5,
    flex: 1,
    flexDirection: "row",
    padding: 8,
    borderBottomColor: "#999",
    borderBottomWidth: 2,
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
    fontSize: 18,
    marginStart: 5,
  },
  iconCard: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  childIcon: {
    color: "#fbb200",
    marginEnd: 20,
    fontSize: 20,
    alignItems: "baseline"
  },
  cardBody: {
    // justifyContent: "space-between",
    flex: 1,
    // flexDirection: "row",
    marginTop: 5,
    marginBottom: 20
  },
  cardTalp: {
    flexDirection: "column",
    justifyContent: "center"
  },
  headerTalp: {
    borderBottomColor: "#FFF",
    borderBottomWidth: 1,
    paddingBottom: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  textHeaderTalp: {
    backgroundColor: "#fff",
    fontSize: 20,
    textAlign: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius:10,
    color:'#666'
  },
  textTalp: {
    fontSize: 15,
    padding: 10
  }

})
