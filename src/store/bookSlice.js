import { createSlice } from "@reduxjs/toolkit";

export const bookSlice = createSlice({
  name: "bookSlice",
  initialState: null,
  reducers: {
    book: (book, action) => {
        return action.payload
    },
    
  },
});

export const { book } = bookSlice.actions;
export const selectbook = (state) => state.book;
export default bookSlice.reducer;
