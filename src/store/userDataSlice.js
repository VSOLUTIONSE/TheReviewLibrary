import { createSlice } from "@reduxjs/toolkit";

export const userDataSlice = createSlice({
    name: "userData",
    initialState: {
        propertyNames: [1, 4],
        uniqueUser: true,
    },
    reducers: {
        populatePropertyNames: (userData, action)=>{
            userData.propertyNames = action.payload;
        },
        populateUniqueUser: (userData, action)=>{
            userData.uniqueUser = action.payload

        },
        updateLike: (userData, action)=>{
         const user=   userData.uniqueUser;
         user[action.payload] = true;
        },
        updateUnlike: (userData, action)=>{
         const user=   userData.uniqueUser;
         user[action.payload] = false;
        },
        addNewCommentId: (userData, action)=>{
            const properties =   userData.propertyNames;
            properties.push(action.payload)
            const user =   userData.uniqueUser;
            user[action.payload] = false;
        }
       
    }
}) 

export const { populatePropertyNames,populateUniqueUser, updateLike, updateUnlike, addNewCommentId} = userDataSlice.actions;
export const selectUserData = (state) => state.userData
export default userDataSlice.reducer;
