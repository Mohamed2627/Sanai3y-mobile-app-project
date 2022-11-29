import { createSlice } from "@reduxjs/toolkit";


export const currentRecieverReducer = createSlice({
    name:"recieverData",
    initialState:{currentReciever:{}},
    reducers:{
        sendCurrentReciever: (state, action)=>{
            state.currentReciever = {...action.payload}
        }
    }
})




export const {sendCurrentReciever} = currentRecieverReducer.actions

export default currentRecieverReducer.reducer