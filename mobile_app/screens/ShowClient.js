import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pathUrl } from '../Config/env';
import { useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { get } from 'lodash';
import NotFind from '../components/NotFind';
import { Ionicons } from '@expo/vector-icons';
import { sendCurrentReciever } from '../Redux/Chat/ImageUrlSlicer';
import { useDispatch } from 'react-redux';
import { getImageUrl } from '../Config/imageUrl';
import Loader from '../components/Loder';



export default function ShowClient(props) {


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
    // End Image in Modal 
    const [jobs, setJobs] = useState([])

    // Making the conversation variables
    const [token, setToken] = useState("");
    const [currentSender, setCurrentSender] = useState({});
    const [conversations, setConversations] = useState([]);
    const [currentReciever, setCurrentReciever] = useState({});
    const [role , setRole]= useState('')
    const [ loader , setLoader] = useState(true)
    // Getting the token of the current sender (current sanai3y)
    useEffect(() => {
        AsyncStorage.getItem('snai3yRole').then((i)=> setRole(i))
        const getToken = async () => {
            const toke = await AsyncStorage.getItem("token");
            setToken(toke);
        }
        getToken();
        // setTimeout(() => {
        //     setLoader(false)
        // }, 1000);
    }, [])

    // Fetching the data of the current sender (current sanai3y)
    useEffect(() => {
        const getCurrentSender = async () => {
            const res = await axios.get(`${pathUrl}/client/user`, { headers: { authorization: token } });
            // console.log(res.data.data)
            setCurrentSender({ ...res.data.data });
        }
        getCurrentSender();
    }, [token])


    // Fetching the conversations of the current sender (current sanai3y)
    useEffect(() => {
        const getConversations = async () => {
            const res = await axios.get(`${pathUrl}/conversations/${currentSender?._id}`);
            // console.log(res.data.data);
            setConversations([...res.data.data])
        }
        getConversations();
    }, [currentSender])



    // Fetching the data of the current reciever (current client)

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
    const navigation = useNavigation()

    useEffect(() => {
        setTimeout(() => {
            axios.get(`${pathUrl}/client/clients/${data.clientData?._id}`)
                .then((res) => {
                    setJobs([...res.data.Data.jobs])
                    // Setting the current reciever data (current client)
                    // console.log(res.data.Data)
                    let newImage = getImageUrl(res.data.Data.img)
                    setCurrentReciever({ ...res.data.Data, img: newImage })
                    if(res.status == 200){
                        setLoader(false)
                    }
                }).catch((err) => console.log(err))
        }, 100);

    }, [])

    return (
        <>
            {!loader&&<ScrollView style={{ backgroundColor: "#fff" }}>

                <View style={styles.parent}>
                    <View style={styles.image}>
                        <View style={styles.imgProfile}>
                            <View>
                                <Image source={{ uri: `${pathUrl}${data.clientData?.img.slice(21)}` }}
                                    style={{ width: 200, height: 200, borderTopLeftRadius: 5, borderTopRightRadius: 5, resizeMode: "cover" }}
                                />
                            </View>
                            <View>
                                <TouchableOpacity onPress={makeNewConversation}
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "#eee",
                                        padding: 5,
                                        borderBottomStartRadius: 5,
                                        borderBottomEndRadius: 5,
                                    }}
                                >
                                    <Ionicons name="chatbox-ellipses" size={30} color="#fbb200" />
                                </TouchableOpacity>
                            </View>

                        </View>

                        <View style={styles.userName}>
                            <Text style={{ textAlign: "center", fontSize: 25 }}>{`${data.clientData?.firstName} ${data.clientData?.lastName}`}</Text>

                        </View>

                    </View>

                    {/* Details user */}
                    <View style={styles.parentList}>
                        {role == "client" &&<View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.textcol}>{data.clientData?.phoneNumber}</Text>
                            </View>
                            <View style={styles.col}>
                                <Entypo name='phone' style={styles.iconCol} />
                            </View>
                        </View>}

                        {/* address */}
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.textcol}>{`العنوان : ${data.clientData?.address}`}</Text>
                            </View>
                            <View style={styles.col}>
                                <Entypo name='location-pin' style={styles.iconCol} />
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.textcol}>{`عدد المنشورات : ${jobs?.length}`}</Text>
                            </View>
                            <View style={styles.col}>
                                <MaterialIcons name='post-add' style={styles.iconCol} />
                            </View>
                        </View>
                    </View>

                    {/* Talbat */}
                    <View style={{ alignItems: "center", marginTop: 20 }}>
                        <Text style={{ fontSize: 25, borderBottomColor: "#eee", borderBottomWidth: 2 }}>المنشورات</Text>
                    </View>

                    {/* Card Style */}

                    {jobs.length > 0 && jobs.map((item, index) =>
                        <View style={styles.card} key={index}>
                            <View style={styles.cardBody}>
                                {/* jop des */}
                                <View style={{ width: "50%", alignItems: "flex-start", padding: 10 }}>
                                    <View>
                                        <Text style={styles.text}>عنوان الوظيفة :{item.title}</Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.text, { marginTop: 10 }]}>الوصف : {item.description}</Text>
                                    </View>
                                </View>
                                {/* img Jop */}
                                <View style={{ width: "50%" }}>
                                    <Image
                                        source={{ uri: `${pathUrl}${item.image?.slice(21)}` }}
                                        style={{ height: 200, resizeMode: "contain" }} />
                                </View>
                            </View>
                            {role != "client" && <View
                                style={{
                                    flex:1,
                                    justifyContent:"flex-end",
                                    alignItems:"center",
                                    marginBottom:10
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        width:"30%",
                                        // justifyContent:"flex-end",
                                        alignItems:"center"
                                    }}
                                >
                                    <Text
                                        style={{
                                            backgroundColor: "#ffb200",
                                            paddingHorizontal: 10,
                                            paddingVertical: 10,
                                            borderRadius: 5,
                                            // alignItems:"center",
                                            justifyContent:"center"
                                        }}
                                        onPress={() =>
                                            navigation.navigate("SendTalp", { one: item })
                                        }
                                    >
                                        تقديم طلب
                                    </Text>
                                </TouchableOpacity>

                            </View>}
                        </View>
                    )}

                    {jobs.length == 0 && <NotFind data={"لاتوجد منشورات الان"} />}
                </View>
            </ScrollView>}
            
            {loader && <Loader/>}
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
        fontSize: 20,
        color: "#fbb200"
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
