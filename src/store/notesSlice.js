import { createSlice } from "@reduxjs/toolkit";

export const notesSlice = createSlice({
  name: "notes",
  initialState: [],
  reducers: {
    addComment: (notes, action) => {
      let newNote = action.payload;
      newNote.id = notes.length
        ? Math.max(...notes.map((note) => note.id)) + 1
        : 1;
      notes.push(newNote);
    },
    returnFromDb: (notes, action) => {
      // console.log(action.payload)
      return action.payload;
    },
    eraseNote: (notes, action) => {
      return notes.filter((note) => note.id != action.payload);
    },
  },
});

export const { addComment, returnFromDb, eraseNote } = notesSlice.actions;

export const selectNotes = (state) => state.notes;

export default notesSlice.reducer;
