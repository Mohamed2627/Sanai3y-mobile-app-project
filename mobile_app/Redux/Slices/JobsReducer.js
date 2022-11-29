import AsyncStorage from "@react-native-async-storage/async-storage";
import {  createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useState } from "react";
import { pathUrl } from "../../Config/env";
import { getImageUrl } from "../../Config/imageUrl";

export const JobsReducer = createSlice({
    name:"JopsData",
    initialState:{dataJobs:[]},
    reducers:{
        setData: (state,action)=>{
            state.dataJobs = action.payload
        },     
    }
})


export const getDataJops =()=> async (dispatch) =>{
        const res = await axios.get(`${pathUrl}/jobs/all`);
        const result = res.data.data.filter((item) => {
            return item.status != "in progress" && item.status != "compelete"
        })
        dispatch(setData(result));

}



export const {setData} = JobsReducer.actions
// export const showSnai3yData = (state)=> state.Snai3yData.data
export default JobsReducer.reducer