import AsyncStorage from "@react-native-async-storage/async-storage";
import {  createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useState } from "react";
import { pathUrl } from "../../Config/env";
import { getImageUrl } from "../../Config/imageUrl";

export const Snai3yReducer = createSlice({
    name:"Snai3yData",
    initialState:{dataSani3y:{}},
    reducers:{
        setData: (state,action)=>{
            state.dataSani3y = action.payload
        },     
    }
})


export const getDataSnai3y =(id)=> async (dispatch) =>{
        const res = await axios.get(`${pathUrl}/sanai3y/sanai3ies/${id}`);
        let imageUrl = getImageUrl(res.data.Data.img)
        dispatch(setData({...res.data.Data, img: imageUrl}));

}



export const {setData} = Snai3yReducer.actions
// export const showSnai3yData = (state)=> state.Snai3yData.data
export default Snai3yReducer.reducer