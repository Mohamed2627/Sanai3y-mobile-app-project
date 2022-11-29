import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Entypo, FontAwesome, Ionicons } from '@expo/vector-icons'
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pathUrl } from '../Config/env';
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { get } from 'lodash';
import NotFind from '../components/NotFind';
import Loader from "../components/Loder";
import { sendCurrentReciever } from '../Redux/Chat/ImageUrlSlicer';
import { useDispatch } from 'react-redux';
import { getImageUrl } from '../Config/imageUrl';


export default function ShowSanai3y(props) {

  const dispatch = useDispatch();

  // Start Modal
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  // End Modal

  // Start Image in Modal
  const { params } = useRoute()
  const data = get(params, "data")
  const [loader, setLoader] = useState(true)
  // End Image in Modal 
  //   console.log(data);
  // console.log("ahmed");
  const [workstore, setWorkstore] = useState([])


  // The conversation variables
  const [token, setToken] = useState("");
  const [currentSender, setCurrentSender] = useState({});
  const [conversations, setConversations] = useState([]);
  const [currentReciever, setCurrentReciever] = useState({});


  // Getting the token of the current sender (current client)
  useEffect(() => {
    const getToken = async () => {
      const toke = await AsyncStorage.getItem("token");
      setToken(toke);
    }
    getToken();
  }, [])


  // Fetching the data of the current sender (current client)
  useEffect(() => {
    const getCurrentSender = async () => {
      const res = await axios.get(`${pathUrl}/client/user`, { headers: { authorization: token } });
      // console.log(res.data.data)
      setCurrentSender({ ...res.data.data });
    }
    getCurrentSender();
  }, [token])


  // Fetching the conversations of the current sender (current client)
  useEffect(() => {
    const getConversations = async () => {
      const res = await axios.get(`${pathUrl}/conversations/${currentSender?._id}`);
      // console.log(res.data.data);
      setConversations([...res.data.data])
    }
    getConversations();
  }, [currentSender])


  // Making new conversation
  const makeNewConversation = async () => {
    const isConversationFound = conversations.find((conversation) => conversation?.members.includes(currentReciever?._id));

    if (isConversationFound) {
      // console.log(true)
      // console.log(isConversationFound)
      props.navigation.navigate("messages", { conversation: isConversationFound, currentSender, currentReciever });
      dispatch(sendCurrentReciever(currentReciever));

    }
    else {
      // console.log(false)
      // console.log(isConversationFound)

      const newConversation = { senderId: currentSender?._id, recieverId: currentReciever?._id }

      const res = await axios.post(`${pathUrl}/conversations`, newConversation);
      let currentNewChat = res.data.data;
      props.navigation.navigate("messages", { conversation: currentNewChat, currentSender, currentReciever });
      dispatch(sendCurrentReciever(currentReciever));

    }

  }

  // console.log(currentReciever);





  useEffect(() => {
    axios.get(`${pathUrl}/sanai3y/sanai3ies/${data?._id}`)
      .then((res) => {
        setWorkstore(res.data.Data.workStore)
        if (res.status == 200) {
          setTimeout(() => {
            setLoader(false)
          }, 1100);
        }

        // Setting the current reciever data (current sanai3y)
        // console.log(res.data.Data)
        let newImage = getImageUrl(res.data.Data.img)
        setCurrentReciever({ ...res.data.Data, img: newImage })
      }).catch((err) => console.log(err))

  }, [data])


  return (
    <>
      {!loader && <ScrollView style={{ backgroundColor: "#fff" }}>

        <View style={styles.parent}>
          <View style={styles.image}>
            <View style={styles.imgProfile}>
              <View>
                <Image source={{ uri: `${pathUrl}${data?.img.slice(21)}` }}
                  style={{ width: 200, height: 200, borderRadius: 5, resizeMode: "cover" }}
                />
              </View>

            </View>

            <View style={styles.userName}>
              <Text style={{ textAlign: "center", fontSize: 25 }}>{`${data?.firstName} ${data?.lastName}`}</Text>
            </View>
            <TouchableOpacity onPress={makeNewConversation}>
              <Ionicons name="chatbox-ellipses" size={50} color="#fbb200" />
            </TouchableOpacity>
          </View>

          {/* Details user */}
          <View style={styles.parentList}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.textcol}>{data?.skills}</Text>
              </View>
              <View style={styles.col}>
                <Entypo name='tools' style={styles.iconCol} />
              </View>
            </View>

            {/* address */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.textcol}>{`العنوان : ${data?.address}`}</Text>
              </View>
              <View style={styles.col}>
                <Entypo name='location-pin' style={[styles.iconCol]} />
              </View>
            </View>
            {/* numoer of the jops  */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.textcol}>{`عدد الوظائف : ${data?.jobs.length == 0 ? "لا يوجد" : data?.jobs.length}`}</Text>
              </View>
              <View style={styles.col}>
                <Entypo name={data?.jobs.length == 0 ? 'emoji-sad' : "emoji-happy"} style={[styles.iconCol]} />
              </View>
            </View>
          </View>

          {/* Talbat */}
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ fontSize: 25, borderBottomColor: "#eee", borderBottomWidth: 2 }}>معرض الاعمال</Text>
          </View>

          {/* Card Style */}

          {workstore.length > 0 && workstore.map((item, index) =>
            <View style={styles.card} key={index} >
              <View style={styles.cardBody} >
                {/* jop des */}
                <View style={{ width: "50%", alignItems: "flex-start", padding: 10 }}>
                  <View>
                    <Text style={styles.text}>عنوان الوظيفة: {item.title}</Text>
                  </View>
                  <View>
                    <Text style={[styles.text, { marginTop: 10 }]}>الوصف : {item.description}</Text>
                  </View>
                </View>
                {/* img Jop */}
                <View style={{ width: "50%" }}>
                  <Image source={{ uri: `${pathUrl}${item.img?.slice(21)}` }}
                    style={{ height: 200, resizeMode: "contain" }} />
                </View>
              </View>
            </View>
          )}

          {workstore == 0 && <NotFind data={"لاتوجد منشورات "} />}
        </View>
      </ScrollView>}
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
    marginTop: 20
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
    borderBottomColor: "gray",
    paddingBottom: 10,
  },
  textcol: {
    fontSize: 18,
    textAlign: "left"
  },
  iconCol: {
    fontSize: 22,
    color: "#fbb200"
  },
  // End Details Style

  // Start Card Style
  card: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    backgroundColor: "#eee",
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 5,
    elevation: 5
  },
  cardHeader: {
    backgroundColor: "#eee",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 8,
    borderBottomColor: "gray",
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
    borderRadius: 50
  },
  text: {
    fontSize: 18,
    marginStart: 5
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
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 20
  },
  parentButton: {
    marginBottom: 25,
    marginTop: 10
  },
  // Button Style
  button: {
    // flex:1,
    width: "50%",
    alignItems: "center",
    // flexDirection: "c",
    justifyContent: "flex-start",
    backgroundColor: "#fbb200",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 25,
    color: "#fff"
  },

})
