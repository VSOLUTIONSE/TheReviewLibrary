import { createSlice } from "@reduxjs/toolkit";

export const likesSlice = createSlice({
  name: "likes",
  initialState: [],
  reducers: {
    returnLikesFromDb: (likes, action) => {
        return action.payload;
    },
  },
});

export default likesSlice.reducer;
export const { returnLikesFromDb } = likesSlice.actions;

export const selectLikes = (state) => state.likes;
