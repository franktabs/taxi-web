import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Compte } from "../Models";

type StateSlice = { user: Compte | null } 

const initialState: StateSlice = {user:null};

const userAuthSlice = createSlice({
    name:"userAuth",
    initialState,
    reducers:{
        toLogin:(state:StateSlice, action:PayloadAction<StateSlice> )=>{
            state.user = action.payload.user;
            
            console.log("changement du state", state);
            
        },
        toLogout:(state:StateSlice)=>{
            state.user = null;
        }
    }

})

export const {toLogin, toLogout} = userAuthSlice.actions

export default userAuthSlice.reducer