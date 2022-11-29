import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { get } from "lodash";
import { AntDesign } from "@expo/vector-icons";
import { pathUrl } from "../Config/env";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToastManager, { Toast } from 'toastify-react-native'
import { useSelector } from "react-redux";
import { getDataSnai3y } from '../Redux/Slices/Snai3yReducer';


export default function SendTalpFromClient() {
  const { params } = useRoute();
  const detailJob = get(params, "one");


  const [proposal, setProposal] = useState("")
  const [role, setRole] = useState('')
  const [token, setToken] = useState('')
  const navigate = useNavigation()

  useEffect(() => {
    AsyncStorage.getItem('snai3yRole').then((i) => setRole(i))
    AsyncStorage.getItem('token').then((i) => setToken(i))
  }, [])



  const dataSani3y = useSelector(state => state.Snai3yReducer.dataSani3y)
  const showToasts = () => {
    Toast.success('تم التقديم بنجاح')
  }
  const showToastsErr = () => {
    Toast.error('برجاء الاشتراك اولا')
  }
  const showToastsErrstatus = () => {
    Toast.error('برجاء اكمال الوظيفة اولا')
  }
  function sendProposal(id) {
    let body = {
      sanai3yProposal: proposal
    }
    // console.log(body)
    AsyncStorage.getItem("token").then((token)=>{
      if(dataSani3y.jobcount <= 0){
        showToastsErr()
      }
      else{
        if(dataSani3y.statusws == "free")
        {

          axios.put(`${pathUrl}/jobs/addproposal/${id}`, body, { headers: { "Authorization": token } })
            .then(res => {
      
              if (res.status == 200) {
                  showToasts()
                  setTimeout(() => {
                    navigate.navigate("HomePost")
                  }, 3000);
                
              }
            }).catch((err) => {
              console.log(err)
            })
        }
        else{
          showToastsErrstatus()
        }
      }
    })



  }




  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ToastManager />
        {/* Start Box Posts */}
        <View style={[styles.box, styles.shadowProp]}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              marginLeft: 10,
            }}
          >
            <Image
              style={styles.tinyLogo}
              source={{
                uri: `${pathUrl}${detailJob.clientData?.img.slice(21)}`,
              }}
            />
            <View style={{ marginLeft: 10, justifyContent: "center" }}>
              <Text
                style={{
                  marginRight: 10,
                  paddingRight: 10,
                  borderRightWidth: 1,
                  borderRightColor: "#ffb200",
                  fontWeight: "bold",
                }}
              >
                {detailJob.clientData?.firstName +
                  " " +
                  detailJob.clientData?.lastName}
              </Text>
              <Text style={{ paddingRight: 10, color: "#999", fontSize: 10 }}>
                {detailJob.city}
              </Text>
            </View>
          </View>
          <Image
            style={styles.tinyLogotest}
            source={{
              // uri: 'http://192.168.1.6'+detailJob?.image?.split('http://localhost')[1],
              uri: `${pathUrl}${detailJob?.image?.slice(21)}`
            }}
          />

          <Text
            style={{ paddingVertical: 10, paddingHorizontal: 10, fontSize: 12 }}
          >
            {detailJob?.title}
          </Text>

          {/* <Text>{JSON.stringify( detailJob.image)}</Text> */}

          <Text
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
          >
            {detailJob?.description}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          ></View>
        </View>
        {/* End Box Posts */}
        {role != "client" && <View style={{ alignItems: "center" }}>
          <TextInput
            multiline={true}
            numberOfLines={2}
            placeholder={"ازاي تقدر تحل المشكلة"}
            onChangeText={newtext => setProposal(newtext)}
            style={{
              padding: 10,
              height: 100,
              width: "90%",
              textAlignVertical: "top",
              backgroundColor: "#eeeeee6e",
              // elevation: 1,
              borderRadius: 5,
              marginTop: 50,
              borderWidth: 2,
              borderColor: "#eee",
            }}
          />
        </View>}

        {role != "client" && <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={{
              width: "50%",
              marginTop: 10,
              backgroundColor: "#ffb200",
              borderRadius: 10,
              marginBottom: 40,
            }}
            onPress={() => sendProposal(detailJob._id)}
          >
            <Text
              style={{
                textAlign: "center",
                backgroundColor: "#ffb200",
                color: "#000",
                width: "100%",
                fontSize: 18,
                padding: 6,
                borderRadius: 10,
              }}

            >
              ارسال الطلب
            </Text>
          </TouchableOpacity>
        </View>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: "#FFF",
    paddingRight: 10,
    paddingLeft: 10,
    margin: 0,
    paddingTop: 20,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  tinyLogotest: {
    width: "100%",
    height: 300,
    marginTop: 10,
    borderRadius: 5,
  },
});
