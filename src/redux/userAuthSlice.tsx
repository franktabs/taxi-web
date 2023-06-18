import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Compte } from "../Models";

const initialState:Compte|null = null;

const userAuthSlice = createSlice({
    name:"userAuth",
    initialState,
    reducers:{
        toLogin:(state:Compte|null, action:PayloadAction<Compte|null> )=>{
            state = action.payload
            console.log("changement du state", state);
        },
        toLogout:(state:Compte|null)=>{
            state = null;
        }
    }

})

export const {toLogin, toLogout} = userAuthSlice.actions

export default userAuthSlice.reducer