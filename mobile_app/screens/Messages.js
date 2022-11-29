import {
    StyleSheet,
    Text,
    View,
    TextInput,
    // Button,
    Image,
    ScrollView,
    FlatList,
    TouchableOpacity
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'react-native-paper'
import axios from 'axios';
import { pathUrl } from '../Config/env';
import { getImageUrl } from '../Config/imageUrl';
import  {io}  from "socket.io-client";
import moment from 'moment';
import { FontAwesome } from '@expo/vector-icons';

const Messages = (props) => {

    // Getting The params
    const params = props.route.params;
    // The scrollRef
    const scrollViewRef = useRef();
    // The Socket
    const socket = useRef();

    // The user
    
    // console.log(newUserImage);
    // let user = {...params.currentSender, img: newUserImage};
    // let user = params.currentSender;
    // const currentChat = params.conversation;
    // const currentReciever = params.currentReciever;

    
    // The user
    const [user, setUser] = useState({})
    // The currentChat
    const [currentChat, setCurrentChat] = useState({})
    // The currentReciever
    const [currentReciever, setCurrentReciever] = useState({})
    // The Messages
    const [messages, setMessages] = useState([]);
    // The newMessage
    const [newMessage, setNewMessage] = useState("")
    // The online users
    const [onlineUsers, setOnlineUsers] = useState([])
    // The recieved Message
    const [recievedMessage, setRecievedMessage] = useState(null);

    // setting the socket variables
    useEffect(() => {
        // The user variable
        let newUserImage = getImageUrl(params.currentSender.img);
        setUser({...params.currentSender, img: newUserImage});

        // The currentChat variable
        setCurrentChat({...params.conversation});
        
        // The currentReciever
        let newCurrentRecieverImage = getImageUrl(params.currentReciever.img)
        setCurrentReciever({...params.currentReciever, img: newCurrentRecieverImage})

    }, [])

    
    // Setting socket current
    useEffect(() => {
        socket.current = (io(pathUrl));
    }, [socket])
    

    // Listening from srever
    useEffect(() => {
        socket.current.emit("addUser", user?._id);
        socket.current.on("getUsers", (users) => {
            setOnlineUsers([...users])
            // console.log(users)


        })

        // Recieving the message
        socket.current.on("recieveMessage", ({ senderId, text }) => {
            // console.log("uuuuuuuuuuu")
            setRecievedMessage({
                conversationId: currentChat?._id,
                sender: senderId,
                text: text,
                createdAt: Date.now()
            });
        })
        
    }, [currentChat, recievedMessage, user])
    // console.log(onlineUsers)

    // Updating the messages
    useEffect(() => {
        if (recievedMessage && currentChat?.members.includes(recievedMessage.sender)) {
            // if (recievedMessage) {

                setMessages((prev) => [...prev, recievedMessage]);
            }
        // recievedMessage &&
        // currentChat?.members.includes(recievedMessage.sender) &&
        // setMessages((prev) => [...prev, recievedMessage]);

        // console.log("hgtfc")
    }, [currentChat, recievedMessage])


    // Fetching the messages of the current conversation
    useEffect(() => {
        const conversationId = params.conversation?._id;
        const getMessages = async () => {
            const res = await axios.get(`${pathUrl}/messages/${conversationId}`);
            // console.log(res.data.data)
            setMessages([...res.data.data])
        }
        getMessages();
    }, []);


    // Sending New Message
    const sendNewMessage = async () => {
        const newMessageBody = {
            conversationId: params.conversation._id,
            sender: params.currentSender?._id,
            text: newMessage
        }

        // Emitting event using socket
        socket.current.emit("sendMessage", {
            senderId: user?._id,
            recieverId: currentReciever._id,
            // recieverId: currentReciever?._id,
            text: newMessage
        })

        try {
            const res = await axios.post(`${pathUrl}/messages`, newMessageBody);
            // console.log(res.data.data)
            setMessages([...messages, res.data.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err)
        }
    }
    
    // // On scrolling 
    // useEffect(() => {
    // scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    //     scrollViewRef.current?.scrollToEnd({ animated: false })
    // }, [messages])
    
    
    // console.log(user)
    // console.log(messages);
    // console.log(newMessage);
    // const own = true;
    // const notOwn = false;
    return (
        <View style={styles.con}>

            <View style={styles.messages}>
                {/* <ScrollView ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false })}
                // onContentSizeChange={() => {
                //     let offset = 0
                //     setInterval(() => {
                //         offset += 500
                //         scrollViewRef.current?.scrollTo({ x: 0, y: offset, animated: false })
                //     }, 5)
                // }}
                > */}
                    <FlatList
                        ref={scrollViewRef}
                        data={messages}
                        keyExtractor={(item, index) => index}
                        renderItem={({ item, index }) =>

                            <View style={(item?.sender === params.currentSender?._id) ? styles.sent_message : styles.recieved_message}>
                                <Image style={styles.image} source={(item?.sender === params.currentSender?._id)? {uri: user?.img}: {uri: params.currentReciever?.img}} />
                                <Text style={(item?.sender === params.currentSender?._id) ? styles.sent_text : styles.recieved_text}>{item?.text}</Text>
                                {/* <Text style={styles.time}><TimeAgo time={item.createdAt} interval={10000} /></Text> */}
                                <Text style={styles.time}>{moment(item.createdAt).fromNow(true) + " ago"}</Text>
                            </View>}
                        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false, behavior: "smooth" })}
                    />
                {/* </ScrollView> */}
            </View>
            <View style={styles.send}>
                <View style={{width:"85%"}}>
                    <TextInput
                        style={styles.input}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={(input) => { setNewMessage(input) }}
                        value={newMessage}
                    />
                </View>
                
                <View style={{width:"12%" ,justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
                    <TouchableOpacity onPress={sendNewMessage} style={styles.button}>
                        <FontAwesome name="send" style={styles.icon} color={"#ffb200"} size={24}/>
                    </TouchableOpacity>

                </View>
            </View>
        </View >
    )
}

export default Messages

const styles = StyleSheet.create({
    con: {
        // flex: 1,
        // height: "100%",
        // backgroundColor: "green"
    },
    messages: {
        height: "92%",
        // backgroundColor: "yellow",
        // position: "relative"
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        margin: 10
    },
    sent_text: {
        fontSize: 20,
        // width: "70%",
        maxWidth: "70%",
        // paddingVertical:0,
        padding: 15,
        borderRadius: 10,
        // borderWidth: 3,
        // borderColor: "white",
        margin: 5,
        backgroundColor: "#fbb150",
        color: "white",
    },
    recieved_text: {
        fontSize: 20,
        // width: "70%",
        maxWidth: "70%",
        padding: 15,
        borderRadius: 10,
        // borderWidth: 3,
        // borderColor: "white",
        margin: 5,
        backgroundColor: "#9b9090",
        color: "white"


    },
    time: {
        fontSize: 10,
        color: "grey",
        margin: 10


        // lineHeight: 50
    },
    send: {
        // padding: 2,
        height: "7%",
        // backgroundColor: "#fbb150",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        justifyContent:"center",
        // paddingBottom:20,
    },
    // message: {
    //     // width: "70%",
    //     borderWidth: 3

    // },
    sent_message: {
        flexDirection: "row",
        alignItems: "center",

        // position: "absolute",

    },
    recieved_message: {
        flexDirection: "row-reverse",
        alignItems: "center",

    },
    input: {
        borderWidth: 1,
        borderColor: "#dadae8",
        borderRadius: 10,
        height: 50,
        fontSize: 18,
        backgroundColor: "white",
        elevation:2,
        paddingStart:5
    },
    // button: {
    //     width: "10%",
    //     // height: "80%",
    //     // backgroundColor: "white",
    //     borderRadius: 10,
    //     // fontSize: "large",
    //     // textAlign: "center",
    //     // textAlignVertical: "center",
    //     marginStart: 5,
    //     justifyContent: "center",
    //     alignItems: "center"
    //     // padding: 10
    // },
    icon: {
        // height: 30,
        // width: 30,
        // marginTop: 20
        // backgroundColor: "green",
        // fontSize: 30,
        // padding: 30
        // alignItems:"center",
        // justifyContent:"center"
    }

})