import { 
    StyleSheet, 
    Text, View, 
    Image,
    TouchableOpacity
} from 'react-native'
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { pathUrl } from '../Config/env';
import { getImageUrl } from '../Config/imageUrl';
import {useDispatch, useSelector} from "react-redux";
import {sendCurrentReciever} from "../Redux/Chat/ImageUrlSlicer"





const Conversations = ({props, conversation, currentSender}) => {

// The current Reciever
// console.log(props);
const [currentReciever, setCurrentReciever] = useState(null); 

// useDispatch
const dispatch = useDispatch();

// Getting the data of the current reciever
useEffect(() => {
    const currentRecieverId = conversation.members.find((id) => id !== currentSender._id);
    // console.log(currentRecieverId);
    const getRecieverData = async () => {
        const res = await axios.get(`${pathUrl}/client/users/${currentRecieverId}`);
        let dataImage = getImageUrl(res.data.data.img)
        setCurrentReciever({...res.data.data, img: dataImage})
        // console.log(dataImage)
        // console.log(currentReciever)
    }

    getRecieverData();

}, [currentSender, conversation]);

console.log(currentReciever)

    return (
        <>
            <TouchableOpacity style={styles.conv}  onPress={()=> {props.navigation.navigate("messages", {conversation, currentSender, currentReciever}); dispatch(sendCurrentReciever(currentReciever))}}>
                    <Image source={{uri: currentReciever?.img}} style={styles.image} />
                    <Text style={styles.recieverName}> {`${currentReciever?.firstName} ${currentReciever?.lastName} `}</Text>
            </TouchableOpacity>
        </>
    )
}

export default Conversations

const styles = StyleSheet.create({
    conv: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor:"#eee",
        marginBottom:10,
        borderRadius:5,
        padding:5
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        margin: 10

    },
    recieverName: {
        fontSize: 20,
    }
})