import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { pathUrl } from '../Config/env';
import Conversations from '../components/Conversations'

const Chat = (props) => {

    // The current user or sender>>> (sanai3y or client)
    const [currentSender, setCurrentSender] = useState(null);

    // The conversations of the current sender
    const [conversations, setConversations] = useState([]);
    // The token of the current sender
    const [token, setToken] = useState("");

    // Getting the conversations of the current sender
    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get(`${pathUrl}/conversations/${currentSender?._id}`);
                console.log(res);
                setConversations([...res.data.data]);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [currentSender]);

    // Fetching the current sender
    useEffect(() => {
        const getCurrentSender = async () => {
            console.log("current");
            const res = await axios.get(`${pathUrl}/client/user`, { headers: { Authorization: token } });
            // console.log(res.data.data);
            setCurrentSender({ ...res.data.data });
        }
        getCurrentSender();
    }, [token])

    // Getting the token of the current sender from the AsyncStorage
    useEffect(() => {
        // Getting token of the current sender from the AsyncStorage
        const getToken = async () => {
            let token = await AsyncStorage.getItem("token");
            setToken(token);
            console.log("token")
        }
        getToken();

        // // To set specific token in AsyncStorage
        // const setToken = async () => {
        //     await AsyncStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IjYzNWZlNDEzYmVkM2QxN2E2OGU3M2ZiZiIsImVtYWlsIjoibUBnbWFpbC5jb20iLCJpYXQiOjE2NjcyMjg2OTF9.XgGTAnZyEEl3wFUeoraAN1h4gpUGTO04zI7Zca9MwrY")
        // }
        // setToken();
    }, [token]);

    // When you need to clear the AsyncStorage
    // AsyncStorage.clear().then(res => console.log("cleared"));

    

    // console.log(token);
    // console.log(conversations);

    return (
        <View style={styles.con}>
            <FlatList
                data={conversations}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) => <View>
                    <Conversations conversation={item} currentSender={currentSender} props={props} />
                    {/* <Conversations/> */}
                </View>}
            />
        </View>
    )
}

export default Chat

const styles = StyleSheet.create({
    con: {
        flex: 1,
        padding: 20,
        backgroundColor: "#FFF",
        color: "#000",
    },
})