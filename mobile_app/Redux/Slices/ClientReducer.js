import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useDispatch } from "react-redux";
import { pathUrl } from "../../Config/env";
import { getImageUrl } from "../../Config/imageUrl";
import { setData } from "./Snai3yReducer";

const ClientReducer = createSlice({
    name:"ClientData",
    initialState:{clintdata:{} , jops:[]},
    reducers:{
        setDataClient: (state,action)=>{
            state.clintdata = action.payload
        },
        setJops:(state , acthion)=>{
            state.jops = acthion.payload
        }
    }
})


export const getDataClient = (idd)=> async (dispatch)=>{
    try {
        
        const res = await axios.get(`${pathUrl}/client/clients/${idd}`)
        let imageUrl =  getImageUrl(res.data.Data.img)
        dispatch(setDataClient({...res.data.Data, img:imageUrl}))
        dispatch(setJops(res.data.Data.jobs))
    } catch (error) {
        console.log(error)
    }
}

export const {setDataClient , setJops} = ClientReducer.actions

export default ClientReducer.reducer